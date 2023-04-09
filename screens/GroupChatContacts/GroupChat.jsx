import React, { useState } from "react";
import { useContactsState } from "./../../slices/contactsSlice";
import { useTheme, Appbar, Searchbar } from "react-native-paper";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import sendSMS from "../../hooks/useSMS";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import { db } from "../../firebase";
import { useUserState } from "../../slices/userSlice";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from "@react-navigation/native";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import { useGroupState } from "../../slices/groupSlice";
import { User } from "../../modals/fireStoreUserConverter";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
export default function GroupChat(props) {
  const contactstate = useContactsState();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState(
    [...contactstate].sort((a, b) => Number(b.inSystem) - Number(a.inSystem))
  );
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#fff",
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
      backgroundColor: "aqua",
    },
    btnPress: {
      backgroundColor: "gray",
    },
  });
  const { colors } = useTheme();
  const theme = useTheme();
  const { addUser } = useUserFirebaseActions();
  let postUsers = [];
  let userstoinvite = [];
  let checkedusers = [];
  const handleOnCheck = (prop) => {
    console.log(prop);
    if (prop !== null) {
      checkedusers.push(prop);
      let userdir = "user/" + prop.phoneNumber;
      postUsers.push({
        color: "#00FFFF",
        privilege: "user",
        uid: prop.phoneNumber,
        user: userdir,
      });
      userstoinvite.push({
        designation: "",
        displayName: prop.name,
        isAdmin: false,
        phoneNumber: prop.phoneNumber,
        photoURL: "",
        status: "invited",
      });
    } else {
      postUsers.pop();
      userstoinvite.pop();
    }
  };
  const { addMemberToGroup } = useGroupFirebaseActions();
  const groupState = useGroupState();
  const userState = useUserState();
  const handleOnPress = async () => {
    userstoinvite.map(async (user) => {
      try {
        await addUser(user);
      } catch (e) {
        console.log(e);
      }
    });
    postUsers.map((member) => {
      return sendSMS(
        convertedPhoneNumber(member.uid),
        "You have been invited to join " +
          groupState.name +
          " group by " +
          userState.displayName +
          " in Intranet app. " +
          "Please join the group by downloading the application using the following link and creating an account using phone number:" +
          convertedPhoneNumber(member.uid) +
          ". " +
          "https://play.google.com/store/apps/details?id=com.intranet.app"
      );
    });
    // await db
    //   .collection("groups")
    //   .doc(groupState.uid)
    //   .update({ members: [...groupState.members, ...postUsers] });
    alert("Members have been invited to Intranet");
  };
  // const handleOnPress = () => {
  //   let limiter = [];
  //   for (let i = 0; i < checkedusers.length; i++) {
  //     limiter.push(false);
  //   }
  //   props.navigation.navigate("ModalPage", { checkedusers, limiter });
  // };
  return (
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
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Add Participants"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={colors.palette.darkGray}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
                marginLeft: -4,
              },
              android: {
                marginTop: 4,
                marginLeft: -4,
              },
            }),
          }}
        />
        <Appbar.Content
          title="Invite"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}
          color={"#4582C3"}
          onPress={() => handleOnPress()}
          style={{
            marginTop: 4,
            marginRight: 15,
            flexDirection: "row",
            justifyContent: "flex-end",
            flex: 0,
          }}
        />
      </Appbar.Header>
      <ScrollView>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        {searchQuery === ""
          ? contacts.map((user, index) => {
              return (
                <View
                  key={"contact-" + index}
                  style={[
                    styles.row,
                    {
                      paddingHorizontal: 10,
                      backgroundColor: colors.palette.almostWhite,
                      width: "93%",
                      alignSelf: "center",
                      borderRadius: 7,
                      paddingVertical: 6,
                      marginVertical: 5,
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: "#606060",
                      flex: 1,
                    }}
                  >
                    {user?.phoneNumber || "No Phone Number"}
                    <Text
                      style={{
                        color: "#909090",
                        fontSize: 12,
                      }}
                    >
                      {"   ~ "}
                      {user.name}
                    </Text>
                  </Text>
                  {
                    <BouncyCheckbox
                      size={25}
                      fillColor="#4582C3"
                      onPress={(isChecked) => {
                        if (isChecked === true) {
                          handleOnCheck(user);
                        } else {
                          handleOnCheck(null);
                        }
                      }}
                      style={{
                        marginLeft: "auto",
                        borderRadius: 25,
                        backgroundColor: "white",
                        elevation: 0,
                      }}
                      contentStyle={{ paddingHorizontal: 3, height: 35 }}
                      labelStyle={{
                        color: "#4582C3",
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 12,
                      }}
                      mode="contained"
                    />
                  }
                </View>
              );
            })
          : contacts.map((user, index) => {
              if (user.name.match(searchQuery)) {
                return (
                  <View
                    key={"contact-" + index}
                    style={[
                      styles.row,
                      {
                        paddingHorizontal: 10,
                        backgroundColor: colors.palette.almostWhite,
                        width: "93%",
                        alignSelf: "center",
                        borderRadius: 7,
                        paddingVertical: 6,
                        marginVertical: 5,
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "#606060",
                        flex: 1,
                      }}
                    >
                      {user?.phoneNumber || "No Phone Number"}
                      <Text
                        style={{
                          color: "#909090",
                          fontSize: 12,
                        }}
                      >
                        {"   ~ "}
                        {user.name}
                      </Text>
                    </Text>
                    {
                      <BouncyCheckbox
                        size={25}
                        fillColor="#4582C3"
                        onPress={(isChecked) => {
                          if (isChecked === true) {
                            handleOnCheck(user);
                          } else {
                            handleOnCheck(null);
                          }
                        }}
                        style={{
                          marginLeft: "auto",
                          borderRadius: 25,
                          backgroundColor: "white",
                          elevation: 0,
                        }}
                        contentStyle={{ paddingHorizontal: 3, height: 35 }}
                        labelStyle={{
                          color: "#4582C3",
                          fontFamily: "Poppins_600SemiBold",
                          fontSize: 12,
                        }}
                        mode="contained"
                      />
                    }
                  </View>
                );
              } else {
                return null;
              }
            })}
      </ScrollView>
    </View>
  );
}
