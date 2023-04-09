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
import Dataex from "../Chat/Components/ChatScreenHeader/DataExtractor";
import {
  useTheme,
  Appbar,
  IconButton,
  Button,
  Avatar,
  Portal,
  Modal,
  Snackbar,
  Dialog,
} from "react-native-paper";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { BottomPopup } from "./bottomPopup";
import { useGroupState } from "../../slices/groupSlice";
import { useUserState } from "./../../slices/userSlice";
import { useEffect } from "react";
import { db, firebase } from "../../firebase";
import * as lodash from "lodash";
function GroupSettings(props) {
  const groupState = useGroupState();
  const userState = useUserState();
  const [members, setmembers] = useState([]);
  const [groups, setgroups] = useState(props.route.params.groups);
  const goToCommunicationLogs = () => {
    props.navigation.navigate("CommunicationLogs");
  };

  const goToNotifications = () => {
    props.navigation.navigate("NotificationsPage");
  };

  const [showSnackBar1, setShowSnackbar1] = React.useState(true);

  const goToHome = () => {
    props.navigation.navigate("Home", { showSnackBar1 });
  };

  useEffect(() => {
    console.log("These are the groups in setting ", groups);
  }, [groups]);
  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
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

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "90%",
    marginLeft: "5%",
  };

  const [visible2, setVisible2] = React.useState(false);

  const onToggleSnackBar = () => setVisible2(!visible2);

  const onDismissSnackBar = () => setVisible2(false);

  const [visible3, setVisible3] = React.useState(false);

  const showDialog = () => setVisible3(true);

  const hideDialog = () => setVisible3(false);

  const [visible4, setVisible4] = React.useState(false);

  const onToggleComingSoon = () => setVisible4(!visible2);

  const onDismissComingSoon = () => setVisible4(false);

  // disband group modal
  const [disband, setDisband] = React.useState(false);
  const onToggleDisband = () => setDisband(!disband);
  const onDismissDisband = () => setDisband(false);

  // block user modal
  const [blockModal, setBlockModal] = React.useState(false);
  const onToggleBlockModal = () => setBlockModal(!blockModal);
  const onDismissBlockModal = () => setBlockModal(false);

  // Popup

  let popupRef = React.createRef();

  const onShowPopup = () => {
    popupRef.show();
  };
  const onClosePopup = () => {
    popupRef.close();
  };

  // Navigation with props opening snackbars

  const [inviteSnackBar, setInviteSnackBar] = React.useState(false);

  const onToggleInviteSnackBar = () => setInviteSnackBar(!visible2);

  const onDismissInviteSnackBar = () => setInviteSnackBar(false);

  const routes = props.route.params;

  React.useEffect(() => {
    if (routes?.showInviteSnackBar === true) {
      onToggleInviteSnackBar();
      props.navigation.setParams({
        showInviteSnackBar: false,
      });
    }
  }, [
    routes?.showInviteSnackBar,
    members,
    onToggleInviteSnackBar,
    props.navigation,
  ]);
  console.log(routes?.showInviteSnackBar);

  const DataGetter = (props) => {
    setmembers([...props]);
  };

  const activeMembers = lodash.filter(members, { status: "active" });
  const pendingMembers = lodash.filter(members, { status: "invited" });

  let blocked = [];
  const blockUser = (blocked) => {
    try {
      db.collection("users")
        .doc(userState.phoneNumber)
        .collection("settings")
        .doc("blocked-users")
        .update({
          blockedUsers: blocked,
        });
    } catch (err) {
      console.log(err);
    }
  };

  const setPhoto = () => {
    let photo = "";
    if (groupState.level !== "individual" && groupState.level !== "Admin") {
      return groupState.photo;
    } else {
      members.map((user) => {
        if (userState.phoneNumber !== user.phoneNumber) {
          if (
            user.photoURL == null ||
            user.photoURL == undefined ||
            user.photoURL == ""
          ) {
            photo =
              "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fprofile.png?alt=media&token=538b8990-d4d2-4403-ba69-d2f106eeda5e";
          } else {
            photo = user.photoURL;
          }
        }
      });
      return photo;
    }
  };

  const numberCall = () => {
    let number = "";
    members.map((user) => {
      if (user.phoneNumber !== userState.phoneNumber) {
        number = user.phoneNumber;
      }
    });
    // console.log("numberwala", number);
    return number;
  };

  // Function rendering the JSX for this screen.
  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={[styles.body]}>
      <Dataex members={groupState.members} Data={DataGetter} />
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
          title={
            groupState.level === "individual" || groupState.level === "Admin"
              ? "User Profile"
              : "Group Settings"
          }
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
          style={{ marginRight: 15, zIndex: 1 }}
          color={"#707070"}
          size={25}
          icon="phone"
          onPress={() => {
            if (Platform === "ios") {
              Linking.openURL(`telprompt:${numberCall()}`);
            } else {
              Linking.openURL(`tel:${numberCall()}`);
            }
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
              style={{ backgroundColor: "#707070" }}
              source={
                setPhoto()
                  ? {
                      uri: setPhoto(),
                    }
                  : {
                      uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
                    }
              }
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
                  width: "80%",
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                    width: "100%",
                  }}
                >
                  {groupState.level === "individual" ||
                  groupState.level === "Admin"
                    ? members.map((member) => {
                        if (userState.phoneNumber !== member.phoneNumber) {
                          return member.displayName;
                        }
                      })
                    : groupState.name}
                </Text>
                {/* <IconButton
                  icon="pencil"
                  color={colors.gray}
                  size={20}
                  // onPress={showModal3}
                  style={{
                    backgroundColor: "transparent",
                  }}
                /> */}
              </View>

              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.text,
                }}
              >
                {groupState.level !== "individual" &&
                groupState.level !== "Admin"
                  ? groupState.members.map((user) => {
                      if (user.privilege === "group-lead") {
                        return members.map((member) => {
                          if (member.phoneNumber === user.uid) {
                            return member.displayName;
                          }
                        });
                      }
                    })
                  : members.map((user) => {
                      if (userState.phoneNumber !== user.phoneNumber) {
                        return user.phoneNumber;
                      }
                    })}{" "}
                &#8226;{" "}
                <Text style={{ fontFamily: "Poppins_500Medium" }}>
                  {groupState.level !== "individual" &&
                  groupState.level !== "Admin"
                    ? "Group Lead"
                    : members.map((user) => {
                        if (userState.phoneNumber !== user.phoneNumber) {
                          if (groupState.level === "Admin") {
                            return "CEO";
                          } else {
                            return user.designation;
                          }
                        }
                      })}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => goToCommunicationLogs()}
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
        {groupState.level !== "individual" && groupState.level !== "Admin" && (
          <TouchableOpacity
            onPress={() => goToNotifications()}
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
                  marginBottom: 0,
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
                icon="bell"
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
                  Notifications
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
        )}
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => onToggleComingSoon()}
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 0,
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
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          {groupState.level !== "individual" && groupState.level !== "Admin" ? (
            <TouchableOpacity onPress={onShowPopup}>
              <View
                style={[
                  styles.row,
                  {
                    marginTop: 0,
                    marginBottom: 0,
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
                  icon="plus"
                  color="#777CE4"
                  size={20}
                  style={{
                    backgroundColor: "#E1E2FF",
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
                    Add Participant
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
          ) : (
            <TouchableOpacity
              onPress={() => onToggleComingSoon()}
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
          )}
        </View>
        <View
          style={[
            styles.row,
            {
              marginTop: 20,
              marginBottom: 10,
              width: "90%",
              justifyContent: "flex-start",
            },
          ]}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              color: colors.palette.gray,
            }}
          >
            {groupState.level !== "individual" && groupState.level !== "Admin"
              ? "Group Members"
              : "Groups In Common"}
          </Text>
        </View>
        {groupState.level !== "individual" && groupState.level !== "Admin"
          ? activeMembers.map((member, index) => {
              return (
                <View
                  key={(member, index)}
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
                        marginTop: 5,
                        marginBottom: 5,
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
                    <TouchableWithoutFeedback
                      onPress={showModal}
                      style={[styles.row]}
                    >
                      <Avatar.Image
                        size={50}
                        style={{ backgroundColor: "#707070" }}
                        source={
                          member.photoURL
                            ? {
                                uri: member.photoURL,
                              }
                            : require("../../assets/no-profile-picture-placeholder.png")
                        }
                      />
                      <View
                        style={{
                          marginLeft: 12,
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 14,
                            color: colors.primary,
                          }}
                        >
                          {member.displayName} &#8226;{" "}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: 12,
                            color: colors.primary,
                          }}
                        >
                          {member.designation}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: 13,
                            color: colors.text,
                          }}
                        >
                          {groupState.members.map((user) => {
                            if (user.uid === member.phoneNumber) {
                              return user.privilege;
                            }
                          })}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <Button
                      mode="text"
                      uppercase={false}
                      style={{
                        color: colors.primary,
                        marginLeft: "auto",
                        marginRight: -15,
                      }}
                      labelStyle={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: 13,
                        letterSpacing: 0.1,
                      }}
                      onPress={() => alert("Coming Soon")}
                    >
                      {groupState.members.map((user) => {
                        if (user.privilege === "group-lead") {
                          return members.map((member) => {
                            if (member.phoneNumber === user.uid) {
                              return member.displayName;
                            } else {
                              return null;
                            }
                          });
                        } else {
                          return null;
                        }
                      }) !== null
                        ? "remove"
                        : null}
                    </Button>
                  </View>
                </View>
              );
            })
          : groups !== undefined
          ? groups.map((group, index) => {
              if (group.level !== "individual" && group.level !== "Admin") {
                for (let j = 0; j < group.members.length; j++) {
                  if (
                    group.members[j].processedUser.phoneNumber ===
                    userState.phoneNumber
                  ) {
                    if (
                      group.members[j].processedUser.phoneNumber ===
                      userState.phoneNumber
                    ) {
                      return (
                        <View
                          key={group + index}
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
                                marginTop: 5,
                                marginBottom: 5,
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
                            <TouchableWithoutFeedback
                              onPress={() => props.navigation.navigate("Chat")}
                              style={[styles.row]}
                            >
                              <Avatar.Image
                                size={50}
                                source={
                                  group.photo
                                    ? {
                                        uri: group.photo,
                                      }
                                    : {
                                        uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
                                      }
                                }
                              />
                              <View
                                style={{
                                  marginLeft: 12,
                                  flexDirection: "column",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: "Poppins_600SemiBold",
                                    fontSize: 14,
                                    color: "#707070",
                                  }}
                                >
                                  {group.name}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: "Poppins_400Regular",
                                    fontSize: 12,
                                    color: "#707070",
                                  }}
                                >
                                  {group.level}
                                </Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      );
                    }
                  }
                }
              }
            })
          : null}

        {pendingMembers.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("PendingInvites");
              }}
              style={{
                backgroundColor: "#EDEDED",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 30,
              }}
            >
              <Text
                style={{ fontFamily: "Poppins_400Regular", color: "#707070" }}
              >
                Pending Invitations
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPressOut={() => {
            if (
              groupState.level !== "individual" &&
              groupState.level !== "Admin"
            ) {
              onToggleDisband();
            } else {
              onToggleBlockModal();
            }
          }}
          style={[
            styles.row,
            {
              marginTop: 10,
              marginBottom: 30,
              width: "90%",
              justifyContent: "flex-start",
            },
          ]}
        >
          <IconButton
            icon="close"
            color="#E70000"
            size={20}
            style={{
              backgroundColor: "#FFE1E1",
              margin: 0,
              marginRight: 10,
            }}
          />
          <Button
            mode="text"
            uppercase={false}
            compact={true}
            style={{ marginLeft: -5 }}
            color="#E70000"
            labelStyle={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              color: "#E70000",

              letterSpacing: 0.1,
            }}
          >
            {groupState.level === "individual" || groupState.level === "Admin"
              ? "Block User"
              : "Disband Group"}
          </Button>
        </TouchableOpacity>

        {/*<Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View
            style={[
              styles.row,
              {
                width: "100%",
              },
            ]}
          >
            <Button
              mode="text"
              uppercase={false}
              style={{
                marginLeft: -5,
                width: "100%",
              }}
              color={colors.text}
              labelStyle={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.text,
                letterSpacing: 0.1,
              }}
              contentStyle={{
                justifyContent: "flex-start",
              }}
              onPress={() => console.log("Pressed")}
            >
              Message Moazzam Hameed
            </Button>
          </View>
          <View
            style={[
              styles.row,
              {
                width: "100%",
              },
            ]}
          >
            <Button
              mode="text"
              uppercase={false}
              style={{ marginLeft: -5, width: "100%" }}
              color={colors.text}
              labelStyle={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.text,
                letterSpacing: 0.1,
              }}
              contentStyle={{
                justifyContent: "flex-start",
              }}
              onPress={() => console.log("Pressed")}
            >
              View Moazzam Hameed
            </Button>
          </View>
          <View
            style={[
              styles.row,
              {
                width: "100%",
              },
            ]}
          >
            <Button
              mode="text"
              uppercase={false}
              style={{ marginLeft: -5, width: "100%" }}
              color={colors.text}
              labelStyle={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.text,
                letterSpacing: 0.1,
              }}
              contentStyle={{
                justifyContent: "flex-start",
              }}
              onPress={() => {
                showDialog();
                hideModal();
              }}
            >
              Make Group Lead
            </Button>
          </View>
          <View
            style={[
              styles.row,
              {
                width: "100%",
              },
            ]}
          >
            <Button
              mode="text"
              uppercase={false}
              style={{ marginLeft: -5, width: "100%" }}
              color={colors.text}
              labelStyle={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.text,
                letterSpacing: 0.1,
              }}
              contentStyle={{
                justifyContent: "flex-start",
              }}
              onPress={() => {
                onToggleSnackBar();
              }}
            >
              Make Co-Lead
            </Button>
          </View>
        </Modal>
            </Portal> */}

        {/* disband group modal */}
        <Portal>
          <Modal
            visible={disband}
            onDismiss={onDismissDisband}
            contentContainerStyle={containerStyle}
          >
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                Are you sure you want to Disband this Group?
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 20,
                },
              ]}
            >
              <Button
                uppercase={false}
                style={{
                  width: "35%",
                  backgroundColor: "#E70000",
                  marginRight: 12,
                }}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: "white",
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "center",
                }}
                onPress={() => {
                  firebase
                    .firestore()
                    .collection("groups")
                    .doc(groupState.uid)
                    .delete()
                    .then(() => {
                      props.navigation.navigate("Home");
                    });
                }}
              >
                Disband
              </Button>
              <Button
                uppercase={false}
                style={{
                  marginLeft: 12,
                  width: "35%",
                  backgroundColor: "#4582C3",
                }}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: "white",
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "center",
                }}
                onPress={() => {
                  onDismissDisband();
                }}
              >
                Cancel
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* block user modal */}
        <Portal>
          <Modal
            visible={blockModal}
            onDismiss={onDismissBlockModal}
            contentContainerStyle={containerStyle}
          >
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                Are you sure you want to Block This User?
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 20,
                },
              ]}
            >
              <Button
                uppercase={false}
                style={{
                  width: "35%",
                  backgroundColor: "#E70000",
                  marginRight: 12,
                }}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: "white",
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "center",
                }}
                // onPress={() => {
                //   members.map((member) => {
                //     if (userState.phoneNumber !== member.phoneNumber) {
                //       blocked.push({
                //         userName: member.displayName,
                //         phoneNumber: member.phoneNumber,
                //       });
                //     }
                //   }),
                //     console.log(blocked);
                //   blockUser(blocked);
                // }}
              >
                Block
              </Button>
              <Button
                uppercase={false}
                style={{
                  marginLeft: 12,
                  width: "35%",
                  backgroundColor: "#4582C3",
                }}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: "white",
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "center",
                }}
                onPress={() => {
                  onDismissBlockModal();
                }}
              >
                Cancel
              </Button>
            </View>
          </Modal>
        </Portal>

        <View>
          <Portal>
            <Dialog visible={visible3} onDismiss={hideDialog}>
              <Dialog.Title
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: colors.palette.darkGray,
                }}
              >
                Warning
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{
                    lineHeight: 20,
                    fontFamily: "Poppins_400Regular",
                    color: colors.text,
                  }}
                >
                  This user is the Co-Lead of this group. Performing this action
                  will remove them as the Group Lead. Continue?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={hideDialog}
                  uppercase={false}
                  color={colors.primary}
                  labelStyle={{
                    fontFamily: "Poppins_400Regular",
                    color: colors.primary,
                    fontSize: 16,
                    letterSpacing: 0.1,
                  }}
                >
                  Yes
                </Button>
                <Button
                  onPress={hideDialog}
                  uppercase={false}
                  color={colors.primary}
                  labelStyle={{
                    fontFamily: "Poppins_400Regular",
                    color: colors.primary,
                    fontSize: 16,
                    letterSpacing: 0.1,
                  }}
                >
                  No
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

        <BottomPopup
          ref={(target) => (popupRef = target)}
          onTouchOutside={onClosePopup}
          navigation={props.navigation}
        />
      </ScrollView>
      <Snackbar
        visible={visible2}
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
        This user is already the Co-Lead.
      </Snackbar>
      <Snackbar
        visible={inviteSnackBar}
        onDismiss={onDismissInviteSnackBar}
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
        Invites Sent!
      </Snackbar>
      <Snackbar
        visible={visible4}
        onDismiss={onDismissComingSoon}
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
export default GroupSettings;
