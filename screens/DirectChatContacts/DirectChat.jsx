/* eslint-disable @typescript-eslint/indent */
import React, { useState } from "react";
import { useContactsState } from "./../../slices/contactsSlice";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import { useTheme, Appbar, Searchbar } from "react-native-paper";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { db } from "../../firebase";
import HomeHeader from "../Home/Components/HomeHeader/HomeHeader";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import DataExtractor from "../DirectChatContacts/DataExtractor";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import sendSMS from "../../hooks/useSMS";
import { useNavigation } from "@react-navigation/native";
import { useGroupState } from "../../slices/groupSlice";
import { useUserState } from "./../../slices/userSlice";
export default function DirectChat() {
  const [render, setrender] = useState(false);
  const contactstate = useContactsState();
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const GetData = (props) => {
    setrender(true);
    console.log(props);
    setUsers([...users, ...props]);
  };
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
  let postUsers = [];
  const handleOnCheck = (prop) => {
    console.log(prop);
    if (prop !== null) {
      let userdir = "user/" + prop.phoneNumber;
      postUsers.push({
        color: "#00FFFF",
        privilege: "user",
        uid: prop.phoneNumber,
        user: userdir,
      });
    } else {
      postUsers.pop();
    }
  };
  const groupState = useGroupState();
  const [members, setmembers] = useState([]);
  const userState = useUserState();
  const handleOnPress = async () => {
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
    await db
      .collection("groups")
      .doc(groupState.uid)
      .update({ members: [...groupState.members, ...postUsers] });
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
    await db
      .collection("groups")
      .doc(groupState.uid)
      .update({ members: [...groupState.members, ...postUsers] });
    alert("members have been added");
  };
  return (
    <View style={[styles.body]}>
      {render === false ? <DataExtractor Data={GetData} /> : null}
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
          title="Add"
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
          ? render === true
            ? users.map((user, index) => {
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
                        {user.displayName}
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
            : null
          : users.map((user, index) => {
              if (user.displayName.match(searchQuery)) {
                return null;
              }
            })}
      </ScrollView>
    </View>
  );
}
