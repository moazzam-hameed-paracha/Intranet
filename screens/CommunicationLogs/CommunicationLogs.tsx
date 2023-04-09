/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import { useTheme, Appbar, IconButton, Button } from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";

function CommunicationLogs(props) {
  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  // Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
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
      backgroundColor: colors.lighterBlue,
    },
    btnPress: {
      backgroundColor: colors.gray,
    },
    listTab: {
      padding: 15,
      flexDirection: "row",
      alignSelf: "center",
    },
    btnTab: {
      width: getScreenPercentageSize(33).width,
      flexDirection: "row",
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: "center",
      backgroundColor: "#F8F8F8",
    },
  });

  const [page, setPage] = useState("media");

  const docs = () => {
    setPage("docs");
  };

  const links = () => {
    setPage("links");
  };

  const media = () => {
    setPage("media");
  };

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
          title="Media"
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
      </Appbar.Header>

      <View style={[styles.row, { elevation: 2 }]}>
        <TouchableOpacity
          onPress={media}
          style={[
            styles.btnTab,
            { borderRightWidth: 1, borderRightColor: "#D3D3D3" },
          ]}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "#707070",
            }}
          >
            Media
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={docs}
          style={[
            styles.btnTab,
            { borderRightWidth: 1, borderRightColor: "#D3D3D3" },
          ]}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "#707070",
            }}
          >
            Docs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={links} style={styles.btnTab}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "#707070",
            }}
          >
            Links
          </Text>
        </TouchableOpacity>
      </View>

      {page === "media" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 25,
              color: "#707070",
              opacity: 0.7,
            }}
          >
            Coming Soon!
          </Text>
        </View>
      )}

      {page === "docs" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 25,
              color: "#707070",
              opacity: 0.7,
            }}
          >
            Coming Soon!
          </Text>
        </View>
      )}

      {page === "links" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 25,
              color: "#707070",
              opacity: 0.7,
            }}
          >
            Coming Soon!
          </Text>
        </View>
      )}
    </View>
  );
}
export default CommunicationLogs;
