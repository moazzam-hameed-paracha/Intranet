/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState } from "react";

import {
  useTheme,
  Appbar,
  IconButton,
  Button,
  Avatar,
  Snackbar,
} from "react-native-paper";

function UsersProfile(props) {
  const { colors } = useTheme();

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
  });

  const [block, setBlock] = useState(false);

  const toggleBlock = () => {
    setBlock(!block);
  };

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const [visible2, setVisible2] = React.useState(false);

  const onToggleSnackBar2 = () => setVisible2(!visible);

  const onDismissSnackBar2 = () => setVisible2(false);

  const [visible3, setVisible3] = React.useState(false);

  const onToggleSnackBar3 = () => setVisible3(!visible);

  const onDismissSnackBar3 = () => setVisible3(false);

  return (
    <View style={[styles.body]}>
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: colors.palette.white,
          zIndex: 2,
          paddingRight: 10,
        }}
      >
        <Appbar.BackAction
          color={colors.palette.darkGray}
          onPress={() => props.navigation.goBack()}
        />
        <Appbar.Content
          title="Profile"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={colors.palette.darkGray}
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
          color="#707070"
          size={25}
          icon="phone"
          onPress={() => {
            Linking.openURL(`tel:${"+92 344 1529894"}`);
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View
          style={[
            {
              width: "100%",
              backgroundColor: colors.palette.lightestGray,
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 25,
                paddingBottom: 25,
                width: "90%",
                justifyContent: "flex-start",
              },
            ]}
          >
            <Avatar.Image
              size={75}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/users%2F%2B923441529894%2Fprofile.jpeg?alt=media&token=7624c731-addf-40d9-8d57-2adde182733a",
              }}
              style={{ marginTop: 3 }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  Najeeb Amin Pardesi
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                  color: colors.text,
                }}
              >
                Chief Executive Officer
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 15,
                    color: colors.primary,
                  }}
                >
                  +92 344 1529894
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("CommunicationLogs")}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 25,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="file-document"
              color="#E70000"
              size={20}
              style={{
                backgroundColor: "#FFE1E1",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Media, Docs, Links
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onToggleSnackBar3()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="star"
              color="#FFD15B"
              size={20}
              style={{
                backgroundColor: "#FFF4D6",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Starred Messages
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onToggleSnackBar3()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="share"
              color="#4582C3"
              size={20}
              onPress={() => console.log("Pressed")}
              style={{
                backgroundColor: "#E4F1FF",
                borderWidth: 0,
                borderColor: colors.palette.white,
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                Share Profile
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              onPress={() => console.log("Pressed")}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 20,
                marginBottom: 20,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 27,
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.white,
              },
            ]}
          >
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: "#BABABA",
                }}
              >
                1 Group in Common
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                paddingBottom: 15,
                marginLeft: 20,
                width: "90%",
                justifyContent: "flex-start",
              },
            ]}
          >
            <Avatar.Image
              size={65}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  Management
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.text,
                  }}
                >
                  Faiq Javed. &#8226;{" "}
                  <Text style={{ fontFamily: "Poppins_500Medium" }}>
                    Group Lead
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            {
              width: "100%",
              alignItems: "flex-start",
            },
          ]}
        >
          {block ? (
            <TouchableOpacity
              onPress={() => {
                toggleBlock();
                onToggleSnackBar();
              }}
              style={[
                styles.row,
                {
                  marginTop: 0,
                  marginBottom: 20,
                  marginLeft: 13,
                  padding: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5,
                },
              ]}
            >
              <IconButton
                icon="block-helper"
                color="#E70000"
                size={20}
                style={{
                  backgroundColor: "#FFE1E1",
                  borderWidth: 0,
                  borderColor: colors.palette.white,
                }}
              />
              <View
                style={{
                  marginLeft: 12,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: "#E70000",
                  }}
                >
                  Unblock Najeeb Amin Pardesi
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                toggleBlock();
                onToggleSnackBar2();
              }}
              style={[
                styles.row,
                {
                  marginTop: 0,
                  marginBottom: 20,
                  marginLeft: 13,
                  padding: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5,
                },
              ]}
            >
              <IconButton
                icon="block-helper"
                color="#E70000"
                size={20}
                style={{
                  backgroundColor: "#FFE1E1",
                  borderWidth: 0,
                  borderColor: colors.palette.white,
                }}
              />
              <View
                style={{
                  marginLeft: 12,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: "#E70000",
                  }}
                >
                  Block Najeeb Amin Pardesi
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={4000}
        style={{
          backgroundColor: colors.palette.darkGray,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        User Unblocked!
      </Snackbar>
      <Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar2}
        duration={3000}
        style={{
          backgroundColor: colors.palette.darkGray,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        User Blocked!
      </Snackbar>
      <Snackbar
        visible={visible3}
        onDismiss={onDismissSnackBar3}
        duration={4000}
        style={{
          backgroundColor: colors.palette.darkGray,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        This Feature is Coming Soon!
      </Snackbar>
    </View>
  );
}
export default UsersProfile;
