/* eslint-disable semi */
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { useTheme, Appbar, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useGroupState } from "../../../../slices/groupSlice";
import { useUserState } from "../../../../slices/userSlice";
// import { Feather, Entypo, Ionicons } from "@expo/vector-icons"
import { useState } from "react";
import { useEffect } from "react";

const ChatScreenHeader = (props) => {
  const userState = useUserState();
  const groupState = useGroupState();
  const navigation = useNavigation();
  const [subtitle, setsubtitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [title, settitle] = useState("");
  const [members, setmembers] = useState(props.members);
  const [groups] = useState(props.groups);
  useEffect(() => {
    setmembers(props.members);
    console.log(props.groupState.level);
    if (
      props.groupState.level === "individual" ||
      props.groupState.level === "Admin"
    ) {
      if (members !== undefined) {
        let member = members.filter((member) => {
          return member.processedUser.phoneNumber !== userState.phoneNumber;
        });
        if (member[0] !== undefined) {
          setPhoto(member[0].processedUser.photoURL);
          settitle(member[0].processedUser.displayName);
          setsubtitle(member[0].processedUser.designation);
        }
      }
    } else {
      setPhoto(groupState.photo);
      settitle(groupState.name);

      // let sub = "";

      // members.map((user) => {
      //   if (user.processedUser.phoneNumber !== userState.phoneNumber) {
      //     sub = user.processedUser.displayName + "," + sub;
      //   }
      // });
      // setsubtitle(sub);
      let groupleadnum = "";
      let groupLead = "";
      groupState.members.map((user) => {
        if (user.privilege === "group-lead") {
          groupleadnum = user.uid;
        }
      });

      members.map((user) => {
        if (user.processedUser.phoneNumber === groupleadnum) {
          groupLead = user.processedUser.displayName;
        }
      });
      setsubtitle(groupLead + " • " + "Group Lead");
    }
  }, [members, props, groups, groupState, userState]);
  // const goToGroupSettingsScreen = () => {
  //   props.navigation.navigate("GroupSettings");
  // };

  const { colors } = useTheme();

  return (
    <Appbar.Header
      style={{
        width: "100%",
        height: 70,
        backgroundColor: colors.palette.blue,
        zIndex: 2,
        paddingRight: 10,
      }}
    >
      <Appbar.BackAction
        color={colors.palette.white}
        onPress={() => navigation.goBack()}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("GroupSettings", { groups })}
      >
        <Avatar.Image
          size={45}
          source={
            photo
              ? { uri: photo }
              : {
                  uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
                }
          }
          style={{ marginRight: -10 }}
        />
      </TouchableOpacity>
      <Appbar.Content
        onPress={() =>
          navigation.navigate("GroupSettings", { groups, members })
        }
        title={title ? title : "Loading..."}
        titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
        subtitle={subtitle ? subtitle : "Loading..."}
        subtitleStyle={{ fontSize: 12, marginTop: -5, color: "white" }}
        color={colors.palette.white}
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
      <Appbar.Action
        style={{ marginRight: 5, zIndex: 1 }}
        color={colors.palette.white}
        size={25}
        icon="magnify"
        onPress={() => {}}
      />
    </Appbar.Header>
  );
};

export default ChatScreenHeader;
