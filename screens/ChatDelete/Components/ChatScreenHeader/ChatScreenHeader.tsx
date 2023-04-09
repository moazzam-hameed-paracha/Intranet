/* eslint-disable semi */
import React from "react"
import { Platform, TouchableOpacity } from "react-native"
import { useTheme, Appbar, Avatar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native";
// import { Feather, Entypo, Ionicons } from "@expo/vector-icons"

const ChatScreenHeader = (props) => {

  const navigation = useNavigation(); 

  const { colors } = useTheme()

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
        onPress={() => props.navigation.goBack()}
      />
      <TouchableOpacity 
        onPress={() => navigation.navigate("GroupSettingsTest")}
      >
        <Avatar.Image
          size={45}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
          }}
          style={{ marginRight: -10 }}
        />
      </TouchableOpacity>
      <Appbar.Content
        title="Test"
        titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
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
