import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import RadioButtonRN from "radio-buttons-react-native";
import Icon from "react-native-vector-icons/AntDesign";

import {
  useTheme,
  Appbar,
  IconButton,
  Button,
  Avatar,
  List,
  Snackbar,
} from "react-native-paper";
import { useUserState } from "../../slices/userSlice";

import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import AccordionList from "../../components/AccordionList/AccordionList";
import { db, firebase } from "../../firebase";
import { useDispatch } from "react-redux";

// Radio Buttons

const chatTime = [
  {
    label: "1-hour",
  },
  {
    label: "2-hours",
  },
  {
    label: "24-hours",
  },
  {
    label: "always",
  },
];

const allowChat = [
  {
    label: "only-management",
  },
  {
    label: "all-members",
  },
];

function PrivacySettings(props) {
  const userState = useUserState();

  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  const [allowedUser, setAllowedUser] = useState([]);

  const fetchAllowedUsers = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(userState.phoneNumber)
      .collection("settings")
      .doc("chat-settings")
      .get()
      .then((doc) => {
        const userDoc = doc.data();
        setAllowedUser(userDoc.allowedUsers);
      });
  };

  React.useEffect(() => {
    fetchAllowedUsers();
    console.log(allowedUser);
  }, []);

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
  });

  // SnackBar

  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const [visible2, setVisible2] = useState(false);

  const onToggleSnackBar2 = () => setVisible2(!visible2);

  const onDismissSnackBar2 = () => setVisible(false);

  const [c, setC] = useState<String>();
  const [d, setD] = useState<String>();

  const [a, setA] = useState<String>();
  // console.log(a);
  const [b, setB] = useState<String>();
  // console.log(b);

  useEffect(() => {
    const chatSettings = async () => {
      await firebase
        .firestore()
        .collection("users")
        .doc(userState.phoneNumber)
        .collection("settings")
        .doc("chat-settings")
        .update({
          allowOrDeny: { c },
          chatDuration: { d },
        })
        .then(() => {
          onToggleSnackBar();
        })
        .catch((error) => {
          console.log(error);
          onToggleSnackBar2();
        });
    };

    chatSettings();
  }, [c, d]);

  const ListItem = ({ item }) => (
    <>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingVertical: 7,
        }}
      >
        <View
          style={[
            styles.row,
            {
              width: "95%",
              justifyContent: "flex-start",
            },
          ]}
        >
          <Avatar.Image
            size={55}
            source={
              item.photoURL
                ? { uri: item.photoURL }
                : require("../../assets/no-profile-picture-placeholder.png")
            }
          />
          <View
            style={{
              marginLeft: 12,
              flexDirection: "column",
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingRight: 7,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  {item.userName}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.text,
                  }}
                >
                  {item.designation}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 11,
                    color: colors.primary,
                    marginRight: 10,
                    textDecorationLine: "underline",
                  }}
                >
                  remove
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );

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
          title="Privacy & Security"
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
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            width: getScreenPercentageSize(90).width,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <List.Accordion
            titleStyle={{
              fontFamily: "Poppins_600SemiBold",
              fontWeight: "700",
              color: "#707070",
            }}
            title="Allow or Deny to Chat"
            style={{
              backgroundColor: "#F8F8F8",
              marginVertical: 10,
              borderRadius: 8,
            }}
          >
            <View style={{ flexDirection: "row", paddingHorizontal: 25 }}>
              <View style={{ flex: 1, paddingTop: 20 }}>
                <Text
                  style={{
                    marginBottom: 30,
                    color: "#707070",
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  Only Management
                </Text>
                <Text
                  style={{ color: "#707070", fontFamily: "Poppins_400Regular" }}
                >
                  Allow all Members to Chat
                </Text>
              </View>
              <View>
                <RadioButtonRN
                  data={allowChat}
                  selectedBtn={(ess) => {
                    setA(ess.label);
                    setC(a);
                  }}
                  boxStyle={{
                    height: 43,
                    width: 0,
                    borderColor: "transparent",
                  }}
                  duration={0}
                  icon={<Icon name="checkcircle" size={24} color="#4582C3" />}
                />
              </View>
            </View>

            {a == "only-management" && (
              <>
                <View
                  style={[styles.row, { paddingVertical: 10, paddingLeft: 25 }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#707070",
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      Add Individual
                    </Text>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Button
                      mode="text"
                      onPress={() =>
                        props.navigation.navigate("AddParticipants")
                      }
                      uppercase={false}
                      style={{
                        marginLeft: "auto",
                      }}
                      labelStyle={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 14,
                        letterSpacing: 0.5,
                        color: colors.primary,
                      }}
                    >
                      + Add User
                    </Button>
                  </View>
                </View>
                {allowedUser.length > 0 ? (
                  <FlatList
                    data={allowedUser}
                    renderItem={({ item }) => <ListItem item={item} />}
                    keyExtractor={(item) => item.displayName}
                  />
                ) : (
                  <View></View>
                )}
              </>
            )}

            {/* <View
              style={[
                styles.row,
                {
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                },
              ]}
            >
              <Avatar.Image
                size={50}
                source={require("../../assets/no-profile-picture-placeholder.png")}
              />
              <View
                style={{
                  marginLeft: 12,
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                    color: "#707070",
                  }}
                >
                  Kabir S. &#8226;{" "}
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 11,
                      color: colors.primary,
                    }}
                  >
                    Group Lead
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 13,
                    color: "#999999",
                  }}
                >
                  Team Lead
                </Text>
              </View>
              <Button
                mode="text"
                uppercase={false}
                style={{
                  color: colors.primary,
                  marginLeft: "auto",
                }}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                  letterSpacing: 0.1,
                }}
                onPress={() => console.log("Pressed")}
              >
                Remove
              </Button>
            </View> */}
          </List.Accordion>

          <List.Accordion
            title="Chat Duration"
            titleStyle={{ fontWeight: "700", color: "#707070" }}
            style={{
              backgroundColor: "#F8F8F8",
              marginVertical: 10,
              borderRadius: 8,
            }}
          >
            <View style={{ flexDirection: "row", paddingHorizontal: 25 }}>
              <View style={{ flex: 1, paddingTop: 20 }}>
                <Text
                  style={{
                    marginBottom: 30,
                    color: "#707070",
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  1 Hour
                </Text>
                <Text
                  style={{
                    marginBottom: 30,
                    color: "#707070",
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  2 Hours
                </Text>
                <Text
                  style={{
                    marginBottom: 30,
                    color: "#707070",
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  24 Hours
                </Text>
                <Text
                  style={{
                    marginBottom: 30,
                    color: "#707070",
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  Always
                </Text>
              </View>
              <View>
                <RadioButtonRN
                  data={chatTime}
                  selectedBtn={(e) => {
                    setB(e.label);
                    setD(b);
                  }}
                  boxStyle={{
                    height: 43,
                    width: 0,
                    borderColor: "transparent",
                  }}
                  duration={0}
                  icon={<Icon name="checkcircle" size={24} color="#4582C3" />}
                />
              </View>
            </View>
          </List.Accordion>
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
        Settings Saved
      </Snackbar>
      <Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar2}
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
        Settings did not save!
      </Snackbar>
    </View>
  );
}
export default PrivacySettings;
