import { View, Text, ScrollView, StyleSheet, Platform} from "react-native";
import React from "react";

import { useTheme, Appbar, IconButton, Button } from "react-native-paper";

function DummyNotificationsPage() {
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
    singleInput: {
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 2,
    },
  });


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
          title="Notifications"
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
        <View style={[styles.row,{ width:'90%',marginVertical:13,backgroundColor: colors.palette.almostWhite,}]}>
          <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',borderLeftWidth:4,borderLeftColor:'green',paddingHorizontal:12,paddingVertical:5,}}>
            <View style={[styles.row,{ justifyContent:'flex-start'}]}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Kabir S. &#8226;{" "}
                <Text style={{ fontFamily: "Poppins_500Medium",fontSize:11,color:'#707070'}}>
                  Group Lead
                </Text>
              </Text>
            </View>
            <View style={[styles.row,{justifyContent:'flex-start'}]}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: '#707070',
                  flex:1,
                }}
              >
                Hello
              </Text>
              <Text
                style={{
                  fontFamily:'Poppins_400Regular',
                  color:'#707070',
                  fontSize:11,
                }}
              >Now</Text>
            </View>
          </View>
        </View>
    </View>
  );
}
export default DummyNotificationsPage;
