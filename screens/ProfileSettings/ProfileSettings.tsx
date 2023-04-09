import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { db, firebase } from "../../firebase";

import {
  useTheme,
  Appbar,
  IconButton,
  Button,
  Avatar,
  Provider,
  Portal,
  Modal,
  TextInput,
  Snackbar,
} from "react-native-paper";
import { useUserState } from "../../slices/userSlice";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { phoneNumberVerificationRegex } from "../../utils/regex";
// import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";

import { useUserStateActions } from "../../slices/userSlice";

// groupSlice is a slice that contains the group data. It is used to manage the state of the group data.
// useGroupState is a hook that contains the group data.
// useGroupStateActions is a hook that contains functions to CURD group data in the redux store.
import { useGroupStateActions } from "../../slices/groupSlice";

function ProfileSettings(props) {
  const goToNotifications = () => {
    props.navigation.navigate("NotificationsPage");
  };

  const GroupStateActions = useGroupStateActions();
  const UserStateActions = useUserStateActions();

  const goToPrivacySettings = () => {
    props.navigation.navigate("PrivacySettings");
  };

  const logOut = () => {
    // UserStateActions.resetState() is a function that resets the user state to the initial state. It is used to reset the user state when the app is opened.
    UserStateActions.resetState();

    // GroupStateActions.resetState() is a function that resets the group state to the initial state. It is used to reset the group state when the app is opened.
    GroupStateActions.resetState();

    // Navigate to the login screen after resetting the user state and group state.
    props.navigation.navigate("SignIn");
  };

  const userState = useUserState();

  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  // Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#FFF",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    // use this attribute with View to create a new row
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    btnNormal: {
      backgroundColor: colors.lighterBlue,
    },
    btnPress: {
      backgroundColor: colors.gray,
    },
  });

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [visible3, setVisible3] = React.useState(false);

  const showModal3 = () => setVisible3(true);
  const hideModal3 = () => setVisible3(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "90%",
    marginLeft: "5%",
  };
  const [visible2, setVisible2] = React.useState(false);

  const onToggleSnackBar = () => setVisible2(!visible2);

  const onDismissSnackBar = () => setVisible2(false);

  const [visible4, setVisible4] = React.useState(false);

  const onToggleSnackBar4 = () => setVisible4(!visible4);

  const onDismissSnackBar4 = () => setVisible4(false);

  // Function rendering the JSX for this screen.
  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={[styles.body]}>
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: colors.palette.white,
          zIndex: 2,
        }}
      >
        <Appbar.BackAction
          color={colors.palette.darkGray}
          onPress={() => props.navigation.goBack()}
        />
        <Appbar.Content
          title="Profile Settings"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={colors.palette.darkGray}
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
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View
          style={[
            {
              width: "100%",
              backgroundColor: colors.palette.lightestGray,
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 25,
                paddingBottom: 25,
                width: "90%",
                justifyContent: "flex-start",
              },
            ]}
          >
            <Avatar.Image
              size={75}
              source={
                userState.photoURL
                  ? { uri: userState.photoURL }
                  : require("../../assets/no-profile-picture-placeholder.png")
              }
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
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
                    fontSize: 15,
                    color: colors.text,
                    marginTop: 11,
                  }}
                >
                  {userState.displayName}
                </Text>
                <IconButton
                  icon="pencil"
                  color={colors.gray}
                  size={20}
                  onPress={showModal3}
                  style={{
                    backgroundColor: "transparent",
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                  color: colors.text,
                  marginTop: -6,
                }}
              >
                {userState.designation}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 15,
                  color: colors.primary,
                }}
              >
                {userState.phoneNumber}
              </Text>
            </View>
            <Button
              mode="text"
              onPress={showModal}
              uppercase={false}
              style={{
                marginLeft: "auto",
                marginTop: Platform.OS === "ios" ? 40 : 53,
              }}
              labelStyle={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.primary,
              }}
            >
              Change
            </Button>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => goToNotifications()}
          style={[
            {
              width: "100%",
              alignItems: "center",
              backgroundColor: "white",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 25,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="bell"
              color="#E70000"
              size={20}
              style={{
                backgroundColor: "#FFE1E1",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Notification
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onToggleSnackBar4()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="star"
              color="#FFD15B"
              size={20}
              style={{
                backgroundColor: "#FFF4D6",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Starred Messages
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => goToPrivacySettings()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="shield-check"
              color="#45C359"
              size={20}
              style={{
                backgroundColor: "#E1FFE5",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Privacy &amp; Security
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Support")}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="headset"
              color="#4582C3"
              size={20}
              onPress={() => console.log("Pressed")}
              style={{
                backgroundColor: "#E4F1FF",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Support
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              onPress={() => console.log("Pressed")}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => logOut()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="logout"
              color="gray"
              size={20}
              style={{
                backgroundColor: colors.palette.lightestGray,
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Logout
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Portal>
        <Formik
          initialValues={{ newPhoneNumber: "" }}
          validationSchema={NumberSchema}
          onSubmit={(values, actions) => {
            const user = userState;
            firebase
              .firestore()
              .collection("number-change-request")
              .doc(user.phoneNumber)
              .set({
                userName: user.displayName,
                oldPhoneNumber: user.phoneNumber,
                newPhoneNumber: convertedPhoneNumber(values.newPhoneNumber),
              })
              .catch((error) => console.log(error));

            hideModal();
            actions.resetForm();
            onToggleSnackBar();
          }}
        >
          {(props) => (
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 20,
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  Enter New Phone Number
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                  },
                ]}
              >
                <TextInput
                  label="Phone Number"
                  onChangeText={props.handleChange("newPhoneNumber")}
                  value={props.values.newPhoneNumber}
                  underlineColor="transparent"
                  keyboardType="numeric"
                  maxLength={11}
                  style={{ width: "95%" }}
                />
              </View>
              {props.errors.newPhoneNumber && (
                <View
                  style={[
                    styles.row,
                    {
                      width: "95%",
                      justifyContent: "flex-start",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: "#E70000",
                    }}
                  >
                    {props.errors.newPhoneNumber}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                  },
                ]}
              >
                <Button
                  uppercase={false}
                  style={{
                    marginTop: 30,
                    marginBottom: 15,
                    width: "50%",
                    backgroundColor: "#4582C3",
                  }}
                  color={colors.text}
                  labelStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 16,
                    color: "white",
                    letterSpacing: 0.1,
                  }}
                  contentStyle={{
                    justifyContent: "center",
                  }}
                  onPress={props.handleSubmit}
                >
                  Change
                </Button>
              </View>
            </Modal>
          )}
        </Formik>
      </Portal>

      <Portal>
        <Formik
          initialValues={{ newUserName: "" }}
          validationSchema={NameSchema}
          onSubmit={(values, actions) => {
            const user = userState;
            firebase
              .firestore()
              .collection("name-change-request")
              .doc(user.displayName)
              .set({
                phoneNumber: user.phoneNumber,
                oldUserName: user.displayName,
                newUserName: values.newUserName,
              })
              .catch((error) => console.log(error));

            hideModal3();
            actions.resetForm();
            onToggleSnackBar();
          }}
        >
          {(props) => (
            <Modal
              visible={visible3}
              onDismiss={hideModal3}
              contentContainerStyle={containerStyle}
            >
              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 20,
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  Enter New User Name
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                  },
                ]}
              >
                <TextInput
                  label="User Name"
                  onChangeText={props.handleChange("newUserName")}
                  value={props.values.newUserName}
                  underlineColor="transparent"
                  style={{ width: "95%" }}
                />
              </View>

              {props.errors.newUserName && (
                <View
                  style={[
                    styles.row,
                    {
                      width: "95%",
                      justifyContent: "flex-start",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: "#E70000",
                    }}
                  >
                    {props.errors.newUserName}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                  },
                ]}
              >
                <Button
                  uppercase={false}
                  style={{
                    marginTop: 30,
                    marginBottom: 15,
                    width: "50%",
                    backgroundColor: "#4582C3",
                  }}
                  color={colors.text}
                  labelStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 16,
                    color: "white",
                    letterSpacing: 0.1,
                  }}
                  contentStyle={{
                    justifyContent: "center",
                  }}
                  onPress={props.handleSubmit}
                >
                  Change
                </Button>
              </View>
            </Modal>
          )}
        </Formik>
      </Portal>

      <Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar}
        duration={4000}
        style={{
          backgroundColor: colors.palette.darkGray,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        Request Sent
      </Snackbar>
      <Snackbar
        visible={visible4}
        onDismiss={onDismissSnackBar4}
        duration={4000}
        style={{
          backgroundColor: colors.palette.darkGray,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        This Feature is Coming Soon!
      </Snackbar>
    </View>
  );
}
export default ProfileSettings;

const NumberSchema = Yup.object({
  newPhoneNumber: Yup.string()
    .min(11, "Phone number must be 11 digits")
    .matches(phoneNumberVerificationRegex, "Phone number must be valid"),
});

const NameSchema = Yup.object({
  newUserName: Yup.string().min(3, "Too Short!").max(50, "Too Long!"),
});
