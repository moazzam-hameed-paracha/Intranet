/* eslint-disable @typescript-eslint/indent */
import {
  query,
  // Timestamp,
  // onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Animated,
  // SafeAreaView
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import { Feather, Entypo, Ionicons } from "@expo/vector-icons";
// import Text from "../../components/Text"
import * as Linking from "expo-linking";
//import EmojiPicker from "rn-emoji-keyboard";
import { db } from "../../firebase";
import * as lodash from "lodash";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import {
  GroupInterface,
  GroupMemberPrivilege,
  MessageTypes,
} from "../../modals";
import { useGroupState, useGroupStateActions } from "../../slices/groupSlice";
import { useUserState } from "../../slices/userSlice";

// import ChatTextMessage from "./Components/ChatTextMessage";
import ChatScreenHeader from "./Components/ChatScreenHeader";
import ChatAudioMessage from "./Components/ChatAudioMessage";

// import ChatImageMessage from "./Components/ChatImageMessage";
import { useFirebaseSyncWrapper } from "../../hooks/useFirebaseSyncWrapper";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
// import ChatDocMessage from "./Components/ChatDocMessage";
// import ChatForwardMessage from "./Components/ChatForwardMessage";
// import { isPrivilegeValid } from "../../utils/isPrivilageValid";
// import ChatInvalidMessage from "./Components/ChatInvalidMessage";
import {
  useChatUIState,
  useChatUIStateActions,
} from "../../slices/chatUISlice";
import { Message } from "../../modals/fireStoreMessageConverter";
// import DateDisplaySnackBar from "./Components/DateDisplaySnackBar";
import { Pages } from "../../Pages";
import useChatInput from "./hooks/useChatInput";
// import { current } from "@reduxjs/toolkit";
// import {
//   getDatabase,
//   ref,
//   onValue,
//   set,
//   push,
//   onChildAdded,
// } from "firebase/database";
import { Appbar, Button, Snackbar } from "react-native-paper";
// import { Audio } from "expo-av";

import { theme } from "../../theme";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import { extractFilenameFromUrl } from "../../utils/extractFilenameFromUrl";
// import contactsSlice from "../../slices/contactsSlice";
// import { extractFileTypeFromUrl } from "../../utils/extractFileTypeFromUrl";

// import ImageViewer from "react-native-image-zoom-viewer";

const ChatPage = (props: any) => {
  const GroupState = useGroupState();
  const UserState = useUserState();
  const GlobalGroupState = useGroupState();
  const [showkeyemoji, setshowemoji] = useState(false);
  const [groupId, setgroupId] = useState(props.route.params.groupId);
  const [groups, setgroups] = useState(props.route.params.groups);
  const [members, setmembers] = useState([]);
  useEffect(() => {
    if (groupId === GlobalGroupState.uid) {
      {
        setgroupId(GlobalGroupState.uid);
      }
    }
  }, [GlobalGroupState, groupId]);
  useEffect(() => {}, [GroupState, groupId, members, props.route.params]);
  const goToForwardMessageScreen = () => {
    props.navigation.navigate("ForwardMessage");
  };

  const GroupFirebaseActions = useGroupFirebaseActions();

  const [inputMessage, setInputMessage] = useState("");

  function getTime(date: Date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const handleTakePicture = () =>
    props.navigation.navigate(Pages.Camera, { groupId });

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("");
    }
    // console.log("aao na");
    let t = serverTimestamp();
    // setChatMessages([
    //   ...chatMessages,
    //   {
    //     senderId: currentUser.name,
    //     message: inputMessage,
    //     timestamp: t,
    //   },
    // ])
    GroupFirebaseActions.addMessageToGroup(
      groupId,
      {
        senderId: currentUser.name,
        message: inputMessage,
        timestamp: t,
        type: MessageTypes.TEXT,
      },
      ""
    );
    // var newRef = push(ref.current);
    // console.log(newRef);
    // set(newRef,      {
    //     senderId: currentUser.name,
    //     message: inputMessage,
    //     timestamp: t,
    //   }).then(() => console.log('Added message')).catch((e) => console.log('rtb error', e));
    setInputMessage("");
    setTyping(false);
  }

  // const [date, setDate] = React.useState(
  //   new Date(Date.now() - 24 * 60 * 60 * 1000),
  // );
  const [scrolledUp, setScrolledUp] = React.useState(false);
  const ChatUIState = useChatUIState();
  const [loadingdoc, setLoadingdoc] = React.useState(false);

  const [currentUser] = useState({
    name: UserState.phoneNumber,
    // name: "+923215318238",
  });
  // const UserStateActions = useUserStateActions();
  const GroupStateActions = useGroupStateActions();
  const ChatUIStateActions = useChatUIStateActions();

  const { getGroup } = useGroupFirebaseActions();
  const { getUser } = useUserFirebaseActions();

  const {
    data,
    error: syncError,
    success,
    loading: syncLoading,
  } = useFirebaseSyncWrapper(getGroup(groupId));

  React.useEffect(() => {
    if (data !== undefined && success === true) {
      GroupStateActions.setGroup(data.group.data() as GroupInterface);
    }
    let memberstoset = groups.filter((group) => {
      return groupId === group.uid;
    });
    if (memberstoset[0].members !== undefined) {
      setmembers(memberstoset[0].members);
    }
    console.log("These are groups", groups);
    console.log("These are members", members);
    console.log("syncError", syncError);
    console.log("syncLoading", syncLoading);
    console.log("success", success);
    // console.log("data", data.group.data());
    // if (syncError !== null) {
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncLoading, members]);

  const [messagesSnapShot, loading, error] = useCollection(
    query(
      db
        .collection("groups")
        .doc(groupId)
        .collection("messages")
        .orderBy("timestamp", "asc")
      //.where("timestamp", ">=", date),
    )
  );

  const [loading2, setLoading2] = useState(true);

  const [recording, setRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chatMessages, setChatMessages] = React.useState<Message[] | null>([]);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  React.useEffect(() => {
    if (
      chatMessages === null ||
      (messagesSnapShot !== undefined && !messagesSnapShot.empty)
    ) {
      console.log("This is the message snapshot", messagesSnapShot);
      setLoading2(true);
      setChatMessages(
        messagesSnapShot?.docs.map((doc) => {
          let dd = doc.data();
          if (dd?.timestamp?.seconds) {
            return {
              ...dd,
              timestamp: getTime(new Date(dd.timestamp.seconds * 1000)),
            };
          }
          setLoading2(false);
          return dd;
        })
      );
      if (!scrolledUp) {
        ChatUIStateActions.setScrollToTop(true);
      } else {
        setScrolledUp(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesSnapShot]);

  // const handleScrollToTop = () => {
  //   // decrement the date by a day
  //   // setDate(new Date(date.getTime() - 24 * 60 * 60 * 1000))
  //   setScrolledUp(true)
  // }
  useEffect(() => {
    console.log("[CHAT MESSAGES]", chatMessages);
  }, [chatMessages]);
  const { handleSendAudioMessage } = useChatInput();

  const handleStartRecord = () => {
    setRecording((recording) => !recording);
    // startRecording()
  };

  const handleStopRecord = () => {
    setRecording((recording) => !recording);
    // stopRecording()
  };

  const handleChangeText = (text: string) => {
    if (text.length > 0) {
      setTyping(true);
    } else {
      setTyping(false);
    }
    console.log("length", text.length);
    setInputMessage(text);
  };

  // const scrollViewRef = React.useRef(null)

  // ChatUIStateActions.setScrollToTop(true);
  // scroll down after message send
  // React.useEffect(() => {
  //   if (ChatUIState.scrollToTop) {
  //     scrollViewRef.current.scrollToEnd({ animated: true })
  //     ChatUIStateActions.setScrollToTop(false)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ChatUIState.scrollToTop, messagesSnapShot])

  // cancel all subscriptions and asynchronous tasks in a useEffect cleanup function
  // React.useEffect(() => {
  //   return () => {
  //     console.log("unmount")
  //   }
  // }, [])

  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [recordingTime, setRecordingTime] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("This will run every 4 seconds!");
  //     handleAnimation();
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    });
  };

  const boxInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(224,0,99)", "rgb(100,0,0)"],
  });
  const animatedStyle = {
    backgroundColor: boxInterpolation,
  };
  function formatBytes(bytes, decimals = 0) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  const handleSendDocumentMessage = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      console.log("Sending document..");
      console.log({ result });
      console.log({ "File Size is: ": result.size });
      console.log(formatBytes(result.size));
      const resp = await GroupFirebaseActions.addMessageToGroup(
        GroupState.uid,
        {
          message: result.uri,
          senderId: UserState.phoneNumber,
          privilege: GroupMemberPrivilege.USER,
          timestamp: serverTimestamp(),
          type: MessageTypes.DOCUMENT,
          verifiedUsers: [],
          duration: "null",
        },
        result.name
      );
      if (resp.success) {
        console.log("Document sent");
        setLoadingdoc(false);
      }
      if (resp.error) {
        console.log("Document failed to send");
      }
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <ChatScreenHeader
          groupState={GlobalGroupState}
          groups={groups}
          members={members}
        />
        <ImageBackground
          source={require("../../assets/chat-bg.png")}
          resizeMode="cover"
          style={styles.container}
        >
          <View style={styles.container}>
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: 10,
                height: 30,
                width: 96,
                marginTop: 20,
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
                elevation: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: "#707070",
                  fontSize: 12,
                }}
              >
                Today
              </Text>
            </View>
            {loading ? (
              <View
                style={{
                  height: getScreenPercentageSize(83).height,
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  animating={true}
                  color={theme.colors.primary}
                  size={80}
                  style={{ marginBottom: 50 }}
                />
              </View>
            ) : (
              <>
                <FlatList
                  style={{
                    // backgroundColor: "#FBFDFF",
                    marginHorizontal: 10,
                  }}
                  inverted={true}
                  data={JSON.parse(JSON.stringify(chatMessages)).reverse()}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback>
                      <View
                        style={{
                          marginTop: 6,
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={{
                            maxWidth: Dimensions.get("screen").width * 0.8,
                            backgroundColor: "#fff",
                            elevation: 2,
                            borderRadius: 3,
                            alignSelf:
                              item.senderId === currentUser.name
                                ? "flex-end"
                                : "flex-start",
                            marginHorizontal: 10,
                            padding: item.type === "image" ? 5 : 10,
                            borderLeftWidth:
                              item.senderId === currentUser.name ? 0 : 5,
                            borderLeftColor:
                              item.senderId !== currentUser.name && "#45c359",
                            borderRightWidth:
                              item.senderId === currentUser.name ? 5 : 0,
                            borderRightColor:
                              item.senderId === currentUser.name && "#4582c3",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              goToForwardMessageScreen();
                            }}
                            containerStyle={{
                              backgroundColor: "#F8F8F8",
                              width: 33,
                              height: 33,
                              margin: 0,
                              padding: 0,
                              position: "absolute",
                              left:
                                item.senderId === currentUser.name
                                  ? -40
                                  : undefined,
                              right:
                                item.senderId === currentUser.name
                                  ? undefined
                                  : -40,
                              top:
                                item.senderId === currentUser.name
                                  ? "35%"
                                  : "40%",
                              borderRadius: 30,
                              elevation: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Appbar.Action
                              icon={"share"}
                              size={20}
                              color="#999999"
                              onPress={() => {
                                console.log("do something");
                              }}
                            />
                          </TouchableOpacity>

                          {/* DisplayName For other users only. not for self. And no displayname in direct chat since header has name */}
                          {GroupState.level !== "individual" ? (
                            item.senderId !== currentUser.name ? (
                              <Text
                                style={{
                                  color: "#45C359",
                                  fontSize: 13,
                                  fontFamily: "Poppins_500Medium",
                                }}
                              >
                                {members.map((member) => {
                                  if (
                                    member.processedUser.phoneNumber !==
                                    UserState.phoneNumber
                                  ) {
                                    if (
                                      item.senderId ===
                                      member.processedUser.phoneNumber
                                    ) {
                                      return member.processedUser.displayName;
                                    }
                                  }
                                })}
                              </Text>
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}

                          {item.type === "document" ? (
                            <View>
                              {loadingdoc ? (
                                <ActivityIndicator
                                  animating={true}
                                  color={theme.colors.primary}
                                  size={25}
                                />
                              ) : (
                                <>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* icons for different extensions */}

                                    {item.message.includes(".docx") ||
                                    item.message.includes(".doc") ? (
                                      <Appbar.Action
                                        icon={"file-word"}
                                        size={30}
                                        color="#599AFB"
                                        onPress={() => {}}
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          marginRight: -38,
                                        }}
                                      />
                                    ) : item.message.includes(".jpg") ||
                                      item.message.includes(".jpeg") ||
                                      item.message.includes(".png") ? (
                                      <Appbar.Action
                                        icon={"file-image"}
                                        size={30}
                                        color="#599AFB"
                                        onPress={() => {}}
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          marginRight: -38,
                                        }}
                                      />
                                    ) : item.message.includes(".pdf") ? (
                                      <Appbar.Action
                                        icon={"file-pdf-box"}
                                        size={30}
                                        color="#F40F02"
                                        onPress={() => {}}
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          marginRight: -38,
                                        }}
                                      />
                                    ) : item.message.includes(".xls") ||
                                      item.message.includes(".xlsx") ||
                                      item.message.includes(".xml") ? (
                                      <Appbar.Action
                                        icon={"file-excel"}
                                        size={30}
                                        color="#1D6F42"
                                        onPress={() => {}}
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          marginRight: -38,
                                        }}
                                      />
                                    ) : (
                                      <Appbar.Action
                                        icon={"file"}
                                        size={30}
                                        color="#599AFB"
                                        onPress={() => {}}
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          marginRight: -38,
                                        }}
                                      />
                                    )}

                                    <Button
                                      onPress={() =>
                                        Linking.openURL(item.message)
                                      }
                                      // icon="file"
                                      uppercase={false}
                                      contentStyle={{
                                        overflow: "hidden",
                                        padding: 0,
                                        margin: 0,
                                        paddingLeft: 20,
                                      }}
                                      style={{ margin: 0, padding: 0 }}
                                      labelStyle={{ color: "#707070" }}
                                    >
                                      {extractFilenameFromUrl(item.message)}
                                    </Button>
                                  </View>
                                  <Text
                                    style={{
                                      fontFamily: "Poppins_500Medium",
                                      fontSize: 10,
                                      color: "#707070",
                                      position: "absolute",
                                      bottom: -19,
                                      left: 13,
                                    }}
                                  >
                                    {/* 34.65 kB */}
                                  </Text>
                                </>
                              )}
                            </View>
                          ) : item.type === "image" ? (
                            <View>
                              <View>
                                <TouchableOpacity
                                  onPress={() => {
                                    props.navigation.navigate("FullImage", {
                                      item,
                                      members,
                                    });
                                  }}
                                >
                                  <Image
                                    style={{
                                      height: 300,
                                      width: 250,
                                      borderRadius: 8,
                                    }}
                                    source={{ uri: item.message }}
                                    loadingIndicatorSource={require("../../assets/loading.gif")}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : item.type === "audio" ? (
                            <View>
                              <View>
                                <ChatAudioMessage
                                  duration={item.duration}
                                  uid={item.uid}
                                  senderId={item.senderId}
                                  message={item.message}
                                  privilege={item.privilege}
                                  type={item.type}
                                  timestamp={undefined}
                                  verifiedUsers={item.verifiedUsers}
                                  playbackposition={0}
                                />
                              </View>
                              <Text
                                style={{
                                  fontFamily: "Poppins_500Medium",
                                  fontSize: 10.5,
                                  color: "#707070",
                                  position: "absolute",
                                  bottom: -19,
                                  left: 13,
                                }}
                              >
                                {item.duration}
                              </Text>
                            </View>
                          ) : (
                            <View>
                              <View>
                                <Text
                                  style={{
                                    color: "#383838",
                                    fontSize: 13,
                                    fontFamily: "Poppins_400Regular",
                                  }}
                                >
                                  {item.message}
                                </Text>
                              </View>
                            </View>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Text
                              style={
                                item.type === "image"
                                  ? {
                                      color: "white",
                                      fontSize: 11,
                                      alignSelf: "flex-end",
                                      position: "absolute",
                                      right: "2%",
                                      zIndex: 20,
                                    }
                                  : {
                                      color: "#707070",
                                      fontSize: 11,
                                      alignSelf: "flex-end",
                                    }
                              }
                            >
                              {item.timestamp
                                ? item.timestamp?.toString()
                                : "sending... "}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                />
              </>
            )}
            <View
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <Button onPress={onToggleSnackBar}>{visible ? "Hide" : "Show"}</Button> */}
              <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={70000}
                style={{
                  bottom: 60,
                  elevation: 3,
                  backgroundColor: "#474747",
                  borderRadius: 25,
                  width: 190,
                  paddingLeft: 25,
                  // marginLeft: 100,
                  alignSelf: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <TouchableWithoutFeedback onPress={handleAnimation}>
                    <Animated.View
                      style={{
                        width: 13,
                        height: 13,
                        backgroundColor: "red",
                        borderRadius: 50,
                        elevation: 2,
                        ...styles.box,
                        ...animatedStyle,
                      }}
                    />
                  </TouchableWithoutFeedback>
                </View>
                <Text> Recording...</Text>
              </Snackbar>
              <View style={styles.messageInputView}>
                <Feather
                  style={{ paddingLeft: 10 }}
                  color={"#999999"}
                  name="smile"
                  size={24}
                  this
                  is
                  the
                  emoji
                  toggler
                  onPress={() => setshowemoji(true)}
                />
                <TextInput
                  defaultValue={inputMessage}
                  style={styles.messageInput}
                  placeholder="Message"
                  onChangeText={(text) => handleChangeText(text)}
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity onPress={handleSendDocumentMessage}>
                  <Entypo
                    style={{ paddingRight: 15 }}
                    size={22}
                    name="attachment"
                    color={"#999999"}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleTakePicture}
                style={{ marginLeft: 10 }}
              >
                <Entypo name="camera" size={25} color={"#999999"} />
              </TouchableOpacity>
              {typing ? (
                <TouchableOpacity
                  onPress={sendMessage}
                  style={[styles.messageSendView, { marginLeft: 7 }]}
                >
                  <Icon
                    name="send"
                    type="material"
                    size={30}
                    color={"#4582c3"}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#4582c3",
                    height: 37,
                    width: 37,
                    borderRadius: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 12,
                  }}
                >
                  {recording ? (
                    <Ionicons
                      onPress={() => {
                        handleStopRecord();
                        handleSendAudioMessage();
                        onDismissSnackBar();
                        //resetRecordSnackBar();
                      }}
                      name="stop"
                      size={22}
                      color={"#fff"}
                      style={{ marginLeft: 1.5 }}
                    />
                  ) : (
                    <Ionicons
                      onPress={() => {
                        handleStartRecord();
                        handleSendAudioMessage();
                        //RecordSnackBar();
                        //RecordBlipper();
                        onToggleSnackBar();
                      }}
                      name="mic-outline"
                      size={30}
                      color={"#fff"}
                      style={{ marginLeft: 1.5 }}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
            {/* <EmojiBoard
              showBoard={showkeyemoji}
              onClick={(emoji) => setInputMessage(emoji)}
            /> */}
            {/* <EmojiPicker
              onEmojiSelected={(emoji) => setInputMessage(emoji.emoji)}
              open={showkeyemoji}
              onClose={() => setshowemoji(false)}
            /> */}
          </View>
          {/* <View style={{backgroundColor: "#F5FCFF",
            width:getScreenPercentageSize(100).width, height: getScreenPercentageSize(100).height, elevation:10}}>
            <ImageViewer imageUrls={images} style={{position:"relative", bottom:50}} renderIndicator={() => null} />
          </View> */}
        </ImageBackground>
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#FBFDFF",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  messageInputView: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
  },
  messageInput: {
    height: 50,
    flex: 1,
    paddingRight: 10,
    paddingLeft: 20,
    paddingTop: 3,
    fontFamily: "Poppins_400Regular",
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});

export default ChatPage;
