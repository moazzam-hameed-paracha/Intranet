import { View, Text, Platform, StyleSheet, Image } from "react-native";
import React from "react";
import { useTheme, Appbar } from "react-native-paper";
import { useGroupState } from "../../../../slices/groupSlice";
import { getScreenPercentageSize } from "../../../../utils/getScreenPercentageSize";
import * as lodash from "lodash";
export default function FullImage(props) {
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  });
  const groupState = useGroupState();
  const groupId = groupState.uid;
  const { colors } = useTheme();
  const members = props.route.params.members;
  const items = props.route.params.item;

  return (
    <View style={[styles.body]}>
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          zIndex: 2,
        }}
      >
        <Appbar.BackAction
          color="white"
          onPress={() => {
            props.navigation.navigate("Chat", { groupId });
          }}
        />
        <Appbar.Content
          title={members.map((memb) => {
            if (memb.processedUser.phoneNumber === items.senderId) {
              console.log("hamara member", memb.processedUser.displayName);
              return memb.processedUser.displayName;
            }
          })}
          subtitle={items.timestamp}
          titleStyle={{
            fontFamily: "Poppins_500Medium",
            fontSize: 16,
          }}
          subtitleStyle={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
          }}
          color="white"
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
      </Appbar.Header>
      <View>
        <Image
          style={{
            height: getScreenPercentageSize(100).height,
            width: getScreenPercentageSize(100).width,
            marginBottom: 5,
          }}
          source={{ uri: items.message }}
          loadingIndicatorSource={require("../../../../assets/loading.gif")}
        />
      </View>
    </View>
  );
}
