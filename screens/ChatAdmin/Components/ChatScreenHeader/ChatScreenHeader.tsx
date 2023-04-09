/* eslint-disable semi */
import React from "react"
import { Platform, TouchableOpacity } from "react-native"
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
      <TouchableOpacity>
        <Avatar.Image
          size={45}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fbot-2.png?alt=media&token=405cb696-8e6e-43f5-a996-0bbd1afa743d",
          }}
          style={{ marginRight: -10 }}
        />
      </TouchableOpacity>
      <Appbar.Content
        title="Admin"
        titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 16 }}
        subtitleStyle={{ fontSize: 13, marginTop: -5 }}
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
        onPress={() => {}}
      />
    </Appbar.Header>
  )
}

export default ChatScreenHeader
