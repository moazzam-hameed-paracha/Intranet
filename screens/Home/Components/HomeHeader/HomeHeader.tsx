import { View, Text, Image } from "react-native";
import React from "react";
import { ActivityIndicator, Appbar, Colors } from "react-native-paper";
import { theme } from "../../../../theme";

const HomeHeader = (props) => {
  return (
    <Appbar.Header
      style={{
        width: "100%",
        height: 70,
        backgroundColor: theme.colors.palette.white,
      }}
    >
      <Image
        source={require("../../../../assets/logo.png")}
        style={{
          width: "23%",
          marginLeft: 15,
          marginBottom: 5,
        }}
        resizeMode="contain"
      />
      <Appbar.Content title />
      {props.loading ? (
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      ) : null}
      <Appbar.Action
        color={theme.colors.palette.darkGray}
        size={30}
        style={{ marginRight: 0 }}
        icon="magnify"
        onPress={() => {
          props.setSearchBarVisible(!props.searchBarVisible);
        }}
      />
      <Appbar.Action
        style={{ marginRight: 5, zIndex: 1 }}
        color={theme.colors.palette.darkGray}
        size={30}
        icon="bell-outline"
        onPress={() => {
          props.navigation.navigate("NotificationsPage");
        }}
      />
    </Appbar.Header>
  );
};

export default HomeHeader;
