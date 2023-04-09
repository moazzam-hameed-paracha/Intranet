import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect, useMemo } from "react";
import {
  IconButton,
  useTheme,
  Appbar,
  Menu,
  Button,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import createGroupTest from "../TestFeatures/MemberSetter";
import { db } from "../../firebase";

import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as Yup from "yup";
import { theme } from "../../theme";
import { useStyles } from "./styles";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import {
  fireStoreGroupConverter,
  fireStoreUserConverter,
  GroupInterface,
  GroupLevel,
  GroupMemberPrivilege,
  UserStatus,
} from "../../modals";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import { GroupMember } from "../../modals/fireStoreGroupMemberConverter";
import { generateColors } from "../../utils/generateRandomColor";
import { ContactInterface } from "../../slices/contactsSlice";
import {
  DisplayType,
  PeopleSelectorProps,
} from "../PeopleSelector/PeopleSelector";
import { values } from "lodash";
import { DefaultImages, getDefaultImages } from "../../utils/getDefaultImages";
import { User } from "../../modals/fireStoreUserConverter";
import ProgressDialog from "react-native-progress-dialog";

import sendSMS from "../../hooks/useSMS";

import { useUserState } from "../../slices/userSlice";

function CreateGroup({ navigation: { navigate, goBack } }) {
  const contactListNavigator = () => {
    setLoading2(true);
    console.log("Inside contactListNavigator");
    navigate("PeopleSelector", {
      onSelect: (selectedContacts: ContactInterface[]) => {
        let contact = selectedContacts[0];
        setSelectedContact(contact);
        let contactName = contact.inSystem
          ? contact.user.displayName
          : contact.name;
        let contactPhone = convertedPhoneNumber(
          contact.inSystem ? contact.user.phoneNumber : contact.phoneNumber
        );
        setFieldValue("groupLeaderName", contactName);
        setFieldValue("groupLeaderPhone", contactPhone);
      },
      title: "Select Group Leader",
      multiple: false, // TODO: This options needs to be implemented
      displayType: DisplayType.BOTH,
      onBack: () => {},
      selectedPeople: [],
    });
    setTouched({ groupLeaderPhone: true, groupLeaderName: true });
    setLoading2(false);
  };

  const userState = useUserState();

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactInterface>();
  const { addUser, getUserByPhoneNumber } = useUserFirebaseActions();
  const UserFirebaseActions = useUserFirebaseActions();
  const [ceoInfo, setCeoInfo] = useState({
    displayName: "Loading...",
    photoURL: "",
  });
  useMemo(() => {
    UserFirebaseActions.getCEO().then((data) => {
      setCeoInfo(data.data.users.docs[0].data());
    });
  }, []);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.cancelled === false) {
      setFieldValue("groupPhotoURI", result.uri);
    }
  };

  const { createGroup } = useGroupFirebaseActions();

  const [showSnackBar, setShowSnackbar] = React.useState(true);

  const {
    handleSubmit,
    setFieldValue,
    setTouched,
    errors,
    touched,
    values: {
      groupPhotoURI,
      groupName,
      groupType,
      groupLeaderName,
      groupLeaderPhone,
      leaderDesignation,
    },
  } = useFormik({
    initialValues: initialValues,
    validationSchema: GroupCreateSchema,
    onSubmit: async () => {
      console.log("Submitting....");
      sendSMS(
        convertedPhoneNumber(selectedContact.phoneNumber),
        "You have been invited to join " +
          groupName +
          " group by " +
          userState.displayName +
          " in Intranet app. " +
          "Please join the group by downloading the application using the following link and creating an account using phone number:" +
          convertedPhoneNumber(selectedContact.phoneNumber) +
          ". " +
          "https://play.google.com/store/apps/details?id=com.intranet.app"
      );
      // rest errors
      setTouched({});
      let leadUser = null;
      if (!selectedContact.inSystem) {
        setLoading(true);
        setLoadingText("Inviting User . . .");
        try {
          let createdUser = await addUser(
            new User(
              convertedPhoneNumber(selectedContact.phoneNumber),
              selectedContact.name,
              null,
              leaderDesignation,
              false,
              UserStatus.INVITED,
              null
            )
          );
          if (createdUser.success) {
            leadUser = createdUser.data.userRef;
            // TODO (Faiq): Send SMS to newly invited user
            console.log(
              "Sending invite SMS to number: " +
                convertedPhoneNumber(selectedContact.phoneNumber)
            );
            sendSMS(
              convertedPhoneNumber(selectedContact.phoneNumber),
              "You have been invited to join " +
                groupName +
                " group by." +
                userState.displayName +
                " in Intranet app." +
                "Please join the group by downloading the application using the following link: " +
                "https://play.google.com/store/apps/details?id=com.intranet.app"
            );
          } else {
            console.log("Error creating user: " + createdUser.error);
            Alert.alert(
              "User Invitation Failed",
              createdUser.error.message,
              [{ text: "OK" }],
              { cancelable: false }
            );
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
          return;
        }
      }
      setLoading(true);
      setLoadingText("Creating Group . . .");
      if (leadUser === null) {
        leadUser = (await getUserByPhoneNumber(groupLeaderPhone)).data.user
          .docs[0];
      }
      let groupLeaderRef = db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .doc(leadUser.id);
      // Create Group
      // let newGroupData = await createGroup({
      //   name: groupName,
      //   photo: groupPhotoURI,
      //   level: groupType.split(" ")[0].toLowerCase() as GroupLevel,
      //   members: [
      //     new GroupMember(
      //       leadUser.id,
      //       groupLeaderRef,
      //       generateColors(1)[0],
      //       GroupMemberPrivilege.GROUP_LEAD,
      //     ),
      //   ],
      // });
      // if (newGroupData.success) {
      //   setLoading(false);
      //   navigate("Home");
      // } else {
      //   navigate("Home", { showSnackBar});
      //   console.error(newGroupData.error);
      // }

      //Testing a new Technique to create group
      //Testied the technique and it works for all the scenerios
      let lead = {
        privilege: GroupMemberPrivilege.GROUP_LEAD,
        color: "#ffffff",
        uid: leadUser.id,
        user: "/users/" + leadUser.id,
      };

      let currentuid = "/users/" + userState.phoneNumber;
      let current = {
        privilege: GroupMemberPrivilege.OWNER,
        color: "#fffff",
        uid: userState.phoneNumber,
        user: currentuid,
      };

      const members = [];
      let ceostring = "users/" + ceoInfo.phoneNumber;
      members.push(lead);
      members.push(current);
      members.push({
        color: "fffff",
        privilege: "ceo",
        uid: ceoInfo.phoneNumber,
        user: ceostring,
      });
      let group = {
        name: groupName,
        photo: groupPhotoURI,
        level: groupType.split(" ")[0].toLowerCase() as GroupLevel,
      };
      const newGroupData = await createGroupTest(
        members,
        group,
        "+92idontknowwhattodo"
      );
      if (newGroupData.success) {
        setLoading(false);
        navigate("Home", { showSnackBar });
      } else {
        navigate("Home");
        console.error(newGroupData.error);
      }
    },
  });

  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  const [isGroupTypeSelectMenuVisible, setGroupTypeSelectMenuVisible] =
    React.useState(false);
  const [
    isLeaderDesignationSelectMenuVisible,
    setLeaderDesignationSelectMenuVisible,
  ] = React.useState(false);

  const openGroupTypeSelectMenu = () =>
    setTouched({ groupType: true }) && setGroupTypeSelectMenuVisible(true);
  const closeGroupTypeSelectMenu = () => setGroupTypeSelectMenuVisible(false);

  const openLeaderDesignationSelectMenu = () =>
    setTouched({ leaderDesignation: true }) &&
    setLeaderDesignationSelectMenuVisible(true);
  const closeLeaderDesignationSelectMenu = () =>
    setLeaderDesignationSelectMenuVisible(false);

  const styles = useStyles();

  const doNothing = () => {
    console.log("do nothing");
  };

  // Function rendering the JSX for this screen.
  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={styles.body}>
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: theme.colors.palette.white,
          zIndex: 2,
        }}
      >
        <Appbar.BackAction
          color={theme.colors.palette.darkGray}
          onPress={() => goBack()}
        />
        <Appbar.Content
          title="Create New Group"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={theme.colors.palette.darkGray}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
              },
              android: {
                marginTop: 4,
              },
            }),
          }}
        />
      </Appbar.Header>
      {loading && loadingText.length > 0 ? (
        <ProgressDialog
          visible={loading}
          label={loadingText}
          loaderColor={theme.colors.primary}
        />
      ) : null}

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <KeyboardAvoidingView behavior="position" enabled>
          <View
            style={{
              marginTop: getScreenPercentageSize(4).height,
              marginBottom: getScreenPercentageSize(3).height,
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignSelf: "center", width: 135, height: 135 }}
            >
              <Avatar.Image
                size={135}
                style={{ backgroundColor: "#707070" }}
                source={
                  groupPhotoURI
                    ? { uri: groupPhotoURI }
                    : {
                        uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
                      }
                }
                // style={styles.avatarImage}
              />
            </TouchableOpacity>
            <IconButton
              icon="plus"
              color={theme.colors.palette.white}
              size={25}
              onPress={pickImage}
              style={styles.iconButton}
            />
          </View>

          <View style={{ alignItems: "center", marginBottom: 25 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Tap the <Text style={{ fontWeight: "bold" }}>+</Text> button to
              upload
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
            >
              group icon.
            </Text>
          </View>

          <View>
            <View style={{ marginBottom: 15 }}>
              <TextInput
                label="Group Name"
                keyboardType="default"
                underlineColor="transparent"
                dense={false}
                maxLength={30}
                onChangeText={(text) => setFieldValue("groupName", text)}
                // errorText={touched.groupName && errors.groupName}

                style={[
                  styles.singleInput,
                  {
                    alignSelf: "center",
                    height: 50,
                    borderColor:
                      touched.groupName && errors.groupName
                        ? colors.error
                        : "initial",
                    borderWidth: touched.groupName && errors.groupName ? 1 : 0,
                    paddingHorizontal: 20,
                  },
                ]}
              />
              {touched.groupName && errors.groupName ? (
                <Text
                  style={{
                    color: colors.error,
                    marginLeft: getScreenPercentageSize(11).width,
                  }}
                >
                  {errors.groupName}
                </Text>
              ) : null}
            </View>

            <View>
              <Menu
                visible={isGroupTypeSelectMenuVisible}
                onDismiss={closeGroupTypeSelectMenu}
                anchor={
                  <Button
                    labelStyle={{
                      color: colors.text,
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      letterSpacing: 0.7,
                    }}
                    contentStyle={{
                      justifyContent: "flex-start",
                      paddingTop: 4,
                    }}
                    style={{
                      backgroundColor: colors.background,
                      width: getScreenPercentageSize(78).width,
                      height: 50,
                      elevation: 4,
                      justifyContent: "center",
                      alignSelf: "center",
                      borderColor:
                        touched.groupType && errors.groupType
                          ? colors.error
                          : "initial",
                      borderWidth:
                        touched.groupType && errors.groupType ? 1 : 0,
                    }}
                    uppercase={false}
                    onPress={openGroupTypeSelectMenu}
                  >
                    {groupType}
                  </Button>
                }
                style={{
                  width: getScreenPercentageSize(78).width,
                  marginLeft: getScreenPercentageSize(9).width,
                }}
              >
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    setFieldValue("groupType", "Managerial Group");
                    closeGroupTypeSelectMenu();
                  }}
                  title="Managerial Group"
                />
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    setFieldValue("groupType", "Departmental Group");
                    closeGroupTypeSelectMenu();
                  }}
                  title="Departmental Group"
                />
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    setFieldValue("groupType", "Outsourcing Group");
                    closeGroupTypeSelectMenu();
                  }}
                  title="Outsourcing Group"
                />
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    setFieldValue("groupType", "Temporary Group");
                    closeGroupTypeSelectMenu();
                  }}
                  title="Temporary Group"
                />
              </Menu>
              {touched.groupType && errors.groupType ? (
                <Text
                  style={{
                    color: colors.error,
                    marginLeft: getScreenPercentageSize(11).width,
                  }}
                >
                  {errors.groupType}
                </Text>
              ) : null}
            </View>
            {groupLeaderName && groupLeaderPhone ? (
              <View
                style={{
                  marginTop: 10,
                  padding: 20,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignSelf: "center",
                  width: getScreenPercentageSize(78).width,
                  // borderColor: (touched.groupLeaderName && errors.groupLeaderPhone ? colors.error : "transparent"),
                  // borderWidth: (touched.groupLeaderName && errors.groupLeaderPhone ? 1 : 0),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.primary,
                    }}
                  >
                    {groupLeaderName}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                      color: theme.colors.palette.gray,
                    }}
                  >
                    {groupLeaderPhone}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      textDecorationLine: "underline",
                      color: colors.primary,
                      marginLeft: "auto",
                    }}
                    onPress={() => {
                      console.log("Change Pressed");
                      contactListNavigator();
                    }}
                  >
                    Change
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginVertical: 23 }}>
                {loading2 ? (
                  <ActivityIndicator
                    animating={true}
                    color="#4582C3"
                    size={20}
                    style={{ zIndex: 10, elevation: 5 }}
                  />
                ) : (
                  <Button
                    onPress={() => {
                      console.log("Change Pressed");
                      contactListNavigator();
                    }}
                    labelStyle={{
                      fontSize: 18,
                      letterSpacing: 0.7,
                      fontWeight: "600",
                    }}
                    disabled={loading}
                    style={{
                      alignSelf: "center",
                      backgroundColor: "#E4F1FF",
                      width: getScreenPercentageSize(78).width,
                      height: 55,
                      justifyContent: "center",
                    }}
                    uppercase={false}
                  >
                    + Add Group Leader
                  </Button>
                )}
                {touched.groupLeaderName && errors.groupLeaderName ? (
                  <Text
                    style={{
                      color: colors.error,
                      marginLeft: getScreenPercentageSize(11).width,
                      marginBottom: 10,
                    }}
                  >
                    {errors.groupLeaderPhone}
                  </Text>
                ) : null}
              </View>
            )}

            <View>
              <Menu
                visible={isLeaderDesignationSelectMenuVisible}
                onDismiss={closeLeaderDesignationSelectMenu}
                anchor={
                  <Button
                    labelStyle={{
                      color: colors.text,
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      letterSpacing: 0.7,
                    }}
                    contentStyle={{
                      justifyContent: "flex-start",
                      paddingTop: 4,
                    }}
                    style={{
                      backgroundColor: colors.background,
                      width: getScreenPercentageSize(78).width,
                      height: 50,
                      elevation: 4,
                      justifyContent: "center",
                      alignSelf: "center",
                      borderColor:
                        touched.leaderDesignation && errors.leaderDesignation
                          ? colors.error
                          : "initial",
                      borderWidth:
                        touched.leaderDesignation && errors.leaderDesignation
                          ? 1
                          : 0,
                    }}
                    uppercase={false}
                    onPress={openLeaderDesignationSelectMenu}
                  >
                    {leaderDesignation}
                  </Button>
                }
                style={{
                  width: getScreenPercentageSize(78).width,
                  marginLeft: getScreenPercentageSize(9).width,
                }}
              >
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    setFieldValue("leaderDesignation", "Manager");
                    closeLeaderDesignationSelectMenu();
                  }}
                  title="Manager"
                />
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    setFieldValue("leaderDesignation", "Assistant Manager");
                    closeLeaderDesignationSelectMenu();
                  }}
                  title="Assistant Manager"
                />
              </Menu>
              {touched.leaderDesignation && errors.leaderDesignation ? (
                <Text
                  style={{
                    color: colors.error,
                    marginLeft: getScreenPercentageSize(11).width,
                  }}
                >
                  {errors.leaderDesignation}
                </Text>
              ) : null}
            </View>

            {/* Button Component */}
            <View style={{ marginVertical: 25 }}>
              <SubmitButton
                onPress={handleSubmit}
                width={getScreenPercentageSize(78).width}
                labelStyle={{ fontSize: 18, letterSpacing: 0.7 }}
                disabled={loading}
                style={{ alignSelf: "center" }}
              >
                Create Group
              </SubmitButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
export default CreateGroup;

// Formik Info
const initialValues = {
  groupPhotoURI: "",
  groupName: "",
  groupType: "Select Group Type",
  leaderDesignation: "Select Designation",
  groupLeaderName: "",
  groupLeaderPhone: "",
};

const GroupCreateSchema = Yup.object().shape({
  groupPhotoURI: Yup.string(),
  groupName: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  groupType: Yup.string()
    .notOneOf(["Select Group Type"], "Required")
    .required("Required"),
  leaderDesignation: Yup.string()
    .notOneOf(["Select Designation"], "Required")
    .required("Required"),
  groupLeaderName: Yup.string()
    .notOneOf(["Select Group Leader"], "Required")
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  groupLeaderPhone: Yup.string()
    .notOneOf(["From Contact"], "Required")
    .min(10, "Too Short!")
    .max(13, "Too Long!")
    .required("Required"),
});
