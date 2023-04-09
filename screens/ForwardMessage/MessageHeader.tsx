import { View, Text, Image, Platform } from "react-native";
import React from "react";
import { ActivityIndicator, Appbar, Colors } from "react-native-paper";
import { theme } from "../../theme";
import { useNavigation } from "@react-navigation/native";
const MessageHeader = (props) => {
  const navigation = useNavigation();
  return (
    <Appbar.Header 
        style={{
          width: "100%",
          height: 70,
          backgroundColor: "#4582C3",
          zIndex: 2,
          paddingRight:10,
        }}
      >
        {/* props.navigation is not picking props here so leaving it for later */}
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Forward to.."
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={"white"}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
                marginLeft: -8,
              },
              android: {
                marginTop: 4,
                marginLeft: -4,
              },
            }),
          }}
        />
        <Appbar.Action
          color={"white"}
          size={30}
          icon="magnify"
          onPress={() => {props.setSearchBarVisible(!(props.searchBarVisible));}}
        />
      </Appbar.Header>
  );
};

export default MessageHeader;
