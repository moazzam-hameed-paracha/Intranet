
import {
  query,
  // Timestamp,
  // onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
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

import { db } from "../../firebase";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import {
  fireStoreMessageConverter,
  GroupInterface,
  // GroupMemberPrivilege,
  MessageTypes,
} from "../../modals";
import { useGroupState, useGroupStateActions } from "../../slices/groupSlice";
import { useUserState, useUserStateActions } from "../../slices/userSlice";

// import ChatInputContainer from "./Components/ChatInputContainer";
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

const ChatPageNajeeb = (props: any) => {
  const [chatUser] = useState({
    name: "Faiq",
    profile_image: "https://randomuser.me/api/portraits/men/0.jpg",
    last_seen: "online",
  });
  const GroupFirebaseActions = useGroupFirebaseActions();

  // const images = [
  //   {
  //     url:
  //       "https://raw.githubusercontent.com/AboutReact/sampleresource/master/sample_img.png",
  //   },
  //   {
  //     url:
  //       "https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png",
  //   },
  // ];
  // var reff = useRef<any>();

  // useEffect(() => {
  //   const db = getDatabase();
  //   const reference = ref(db, 'users/messages');

  //   onValue(reference, snapshot => {
  //     if (snapshot) {
  //     var messages= [];
  //     snapshot.forEach(c => messages.push(c.val()));
  //     console.log('RCV Messages',messages);
  //     setChatMessages(messages);
  //     }
  //   });
  //   onChildAdded(reference,snapshot => {
  //     console.log('new message', snapshot);
  //     setChatMessages(c => [...c,snapshot]);
  //   })
  //   ref.current = reference;
  // }, []);

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

  const handleTakePicture = () => props.navigation.navigate(Pages.Camera);

  const groupId = "8osMbgHj61c5KB1kGg62";

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
      "",
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

  const GroupState = useGroupState();
  const UserState = useUserState();
  const ChatUIState = useChatUIState();

  const [currentUser] = useState({
    name: UserState.phoneNumber,
    // name: "+923215318238",
  });

  const UserStateActions = useUserStateActions();
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

    console.log("syncError", syncError);
    console.log("syncLoading", syncLoading);
    console.log("success", success);
    // console.log("data", data.group.data());
    // if (syncError !== null) {
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncLoading]);

  const [messagesSnapShot, loading, error] = useCollection(
    query(
      db
        .collection("groups")
        .doc(groupId)
        .collection("messages")
        .withConverter(fireStoreMessageConverter)
        .orderBy("timestamp", "asc"),
      //.where("timestamp", ">=", date),
    ),
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
        }),
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
  const {
    message,
    setMessage,
    handleSendTextMessage,
    startRecording,
    stopRecording,
    handleSendDocumentMessage,
    handleSendAudioMessage,
  } = useChatInput();

  const handleStartRecord = () => {
    setRecording((recording) => !recording);
    // startRecording()
  };

  const handleStopRecord = () => {
    setRecording((recording) => !recording);
    // stopRecording()
  };

  const handleChangeText = (text: string) => {
    setTyping(true);
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

  let id;
  const RecordSnackBar = () => {  
    id = setInterval(() => {
      console.log("This will run every 1 seconds!");
      setRecordingTime((oldCount) => oldCount + 1);
    }, 1500);
    return () => {
      clearInterval(id);
    };
  };

  const resetRecordSnackBar = () => {
    clearInterval(id);
    setRecordingTime(0);
  };
  
  const RecordBlipper = () => {
    const interval = setInterval(() => {
      console.log("This will run every 4 seconds!");
      handleAnimation();
    }, 4000);
    return () => clearInterval(interval);
  };

  const handleAnimation = () => {
    Animated.timing(animation, {
      toValue:1,
      duration: 2000,
      useNativeDriver: false
    }).start( () => {
      Animated.timing(animation,{
        toValue:0,
        duration: 2000,
        useNativeDriver: false
      }).start();
    });
  };

  const boxInterpolation =  animation.interpolate({
    inputRange: [0, 1],
    outputRange:["rgb(224,0,99)" , "rgb(100,0,0)"]
  });
  const animatedStyle = {
    backgroundColor: boxInterpolation
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <ChatScreenHeader />
        <ImageBackground source={require("../../assets/chat-bg.png")} resizeMode="cover" style={styles.container}>
          <View style={styles.container}>
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: 10,
                height: 30,
                width: 96,
                marginTop: 20,
                marginBottom:10,
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
              24 Aug 2022
              </Text>
              
            </View>
            {/* <View
              style={{
                alignSelf: "center",
                backgroundColor: "#f0f0f0",
                height: 70,
                width: 278,
                margin: 20,
                padding: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            > */}
            {/* <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  color: "#707070",
                  fontSize: 12,
                }}
              >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Justo nec
              felis magna et sed mperdiet congue magna et nunc auctor.
              </Text> */}
            {/* </View> */}
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
                  style={{marginBottom:100}}
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
                      <View style={{ marginTop: 6, marginBottom: 10 }}>
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
                            padding: 10,
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
                          {item.senderId === chatUser.name && (
                            <Text
                              style={{
                                color: "#45C359",
                                fontSize: 13,
                                fontFamily: "Poppins_500Medium",
                              }}
                            >
                              {item.senderId}
                            </Text>
                          )}
                          {item.type === "document" ? (
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <TouchableOpacity 
                                  onPress={() => {console.log("do nothing");}}
                                  containerStyle={{backgroundColor: "#F8F8F8", width: 33, height: 33, margin: 0,
                                    padding: 0,
                                    position: "absolute",
                                    left:
                                item.senderId === currentUser.name
                                  ? -57
                                  : undefined,
                                    right: -55,
                                    top: 13,
                                    borderRadius: 30,
                                    elevation: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}>
                                  <Appbar.Action
                                    icon={"share"}
                                    size={20}
                                    color="#999999"
                                  />
                                </TouchableOpacity>
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
                                <Button
                                  onPress={() => Linking.openURL(item.message)}
                                  // icon="file"
                                  uppercase={false}
                                  contentStyle={{
                                    overflow: "hidden",
                                    padding: 0,
                                    margin: 0,
                                    paddingLeft: 20
                                  }}
                                  style={{ margin: 0, padding: 0 }}
                                  labelStyle={{ color: "#707070" }}
                                >
                                  {extractFilenameFromUrl(item.message)}
                                </Button>
                              </View>
                              <Text style={{fontFamily:"Poppins_500Medium", fontSize:10, color:"#707070", position:"absolute", bottom:-19, left:13}}>34.65 kB</Text>
                            </View>
                          ) : item.type === "image" ? (
                            <View>
                              <TouchableOpacity
                                onPress={() => {console.log("do nothing");}}
                                containerStyle={{backgroundColor: "#F8F8F8", width: 33, height: 33, margin: 0,
                                  padding: 0,
                                  position: "absolute",
                                  left: item.senderId === currentUser.name
                                    ? -57
                                    : 220,
                                  top: item.senderId === currentUser.name
                                    ? 90
                                    : 105,
                                  borderRadius: 30,
                                  elevation: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}>
                                <Appbar.Action
                                  icon={"share"}
                                  size={20}
                                  color="#999999"
                                  onPress={() => {console.log("do nothing");}}
                                />
                              </TouchableOpacity>
                            
                              <View>
                                {item.senderId !== currentUser.name ? (
                                  <Text
                                    style={{
                                      color: "#45C359",
                                      fontSize: 13,
                                      fontFamily: "Poppins_600SemiBold",
                                    }}
                                  >
                                Najeeb
                                  </Text>
                                ) : (
                                  <></>
                                )}
                                <Image
                                  style={{
                                    height: 200,
                                    width: 200,
                                    marginBottom: 5,
                                  }}
                                  source={{ uri: item.message }}
                                  loadingIndicatorSource={require("../../assets/loading.gif")}
                                />
                                {/* <View style={{elevation: 10, position:"absolute", left:-150, display: "flex"}}>
                                  <Image
                                    style={{
                                      height: getScreenPercentageSize(50).height,
                                      width: getScreenPercentageSize(100).width,
                                      display: "flex"
                                    }}
                                    source={{ uri: item.message }}
                                    loadingIndicatorSource={require("../../assets/loading.gif")}
                                  />
                                </View> */}
                              </View>
                            </View>
                          ) : item.type === "audio" ? (
                            <View>
                              <TouchableOpacity
                                onPress={() => {console.log("do nothing");}}
                                containerStyle={{backgroundColor: "#F8F8F8", width: 33, height: 33, margin: 0,
                                  padding: 0,
                                  position: "absolute",
                                  left: item.senderId === currentUser.name
                                    ? -57
                                    : 190,
                                  top: item.senderId === currentUser.name
                                    ? 13
                                    : 22,
                                  borderRadius: 30,
                                  elevation: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}>
                                <Appbar.Action
                                  icon={"share"}
                                  size={20}
                                  color="#999999"
                                  onPress={() => {console.log("do nothing");}}
                                />
                              </TouchableOpacity>
                              <View>
                                {item.senderId !== currentUser.name ? (
                                  <Text
                                    style={{
                                      color: "#45C359",
                                      fontSize: 13,
                                      fontFamily: "Poppins_600SemiBold",
                                    }}
                                  >
                                Najeeb
                                  </Text>
                                ) : (
                                  <></>
                                )}
                                <ChatAudioMessage
                                  uid={item.uid}
                                  senderId={item.senderId}
                                  message={item.message}
                                  privilege={item.privilege}
                                  type={item.type}
                                  timestamp={undefined}
                                  verifiedUsers={item.verifiedUsers}
                                />
                              </View>
                              <Text style={{fontFamily:"Poppins_500Medium", fontSize:10.5, color:"#707070", position:"absolute", bottom:-19, left:13}}>0:06</Text>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity 
                                onPress={() => {console.log("do something");}} 
                                containerStyle={{backgroundColor: "#F8F8F8", width: 33, height: 33, margin: 0,
                                  padding: 0,
                                  position: "absolute",
                                  left: item.senderId === currentUser.name
                                    ? -57
                                    : 70,
                                  top: item.senderId === currentUser.name
                                    ? 3
                                    : 10,
                                  borderRadius: 30,
                                  elevation: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}>
                                <Appbar.Action
                                  icon={"share"}
                                  size={20}
                                  color="#999999"
                                  onPress={() => {console.log("do something");}}
                                />
                              </TouchableOpacity>
                              <View>
                                {item.senderId === currentUser.name ? (
                                  <></>
                                ) : (
                                  <Text
                                    style={{
                                      color: "#45C000",
                                      fontSize: 13,
                                      fontFamily: "Poppins_600SemiBold",
                                    }}
                                  >
                                Najeeb
                                  </Text>
                                )}
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
                            {/* <Text
                            style={{
                              color: "#707070",
                              fontSize: 12,
                              alignSelf: "flex-end",
                              marginLeft: 12,
                            }}
                          >
                            {extractFileTypeFromUrl(item.message).toUpperCase()}
                          </Text> */}

                            <Text
                              style={{
                                color: "#707070",
                                fontSize: 11,
                                alignSelf: "flex-end",
                              }}
                            >
                              {item.timestamp?.toString()}
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
                // action={{
                //   // label: "0:00",
                //   onPress: () => {
                //     // Do something
                //   },
                // }}
                style={{bottom:60, elevation:3, backgroundColor:"#474747", borderRadius:25, width:190, paddingLeft:13, marginLeft:100}}>
                <View style={{flex:1}}>
                  <TouchableWithoutFeedback onPress={handleAnimation}>
                    <Animated.View style={{width:13, height:13, backgroundColor:"red", borderRadius:50, elevation:2, ...styles.box, ...animatedStyle}} />  
                  </TouchableWithoutFeedback>
                </View>
                <Text>  Recording: 0:0</Text>
                <Text>{recordingTime}</Text>
              </Snackbar>
              <View style={styles.messageInputView}>
                <Feather
                  style={{ paddingLeft: 10 }}
                  color={"#999999"}
                  name="smile"
                  size={24}
                  onPress={() => console.log("do nothing")}
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
                  <Icon name="send" type="material" size={30} color={"#4582c3"} />
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
                        resetRecordSnackBar();
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
                        RecordSnackBar();
                        RecordBlipper();
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
    justifyContent: "center"
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
    paddingHorizontal: 10,
    paddingTop:3,
    fontFamily: "Poppins_400Regular",
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});

export default ChatPageNajeeb;
