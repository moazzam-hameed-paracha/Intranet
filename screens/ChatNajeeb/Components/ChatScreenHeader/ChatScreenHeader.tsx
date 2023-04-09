/* eslint-disable semi */
import React from "react"
import { Linking, Platform, TouchableOpacity } from "react-native"
import { useTheme, Appbar, Avatar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native";
// import { Feather, Entypo, Ionicons } from "@expo/vector-icons"

const ChatScreenHeader = (props) => {
  const { colors } = useTheme()
  const navigation = useNavigation(); 
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
      <TouchableOpacity onPress={() => navigation.navigate("UsersProfile")}>
        <Avatar.Image
          size={45}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/users%2F%2B923441529894%2Fprofile.jpeg?alt=media&token=7624c731-addf-40d9-8d57-2adde182733a",
          }}
          style={{ marginRight: -10 }}
        />
      </TouchableOpacity>
      <Appbar.Content
        title="Najeeb Amin Pardesi"
        titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14 }}
        subtitleStyle={{ fontSize: 14, marginTop: -5 }}
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
      <Appbar.Action
        style={{ marginRight: 5, zIndex: 1 }}
        color={colors.palette.white}
        size={25}
        icon="phone"
        onPress={() => {
          Linking.openURL(`tel:${"+92 344 1529894"}`);
        }}
      />
    </Appbar.Header>
  )
}

export default ChatScreenHeader
