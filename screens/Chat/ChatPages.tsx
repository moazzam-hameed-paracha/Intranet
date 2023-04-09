/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable semi */
import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native"
import { Icon } from "react-native-elements"
import { Feather, Entypo, Ionicons } from "@expo/vector-icons"
import ChatScreenHeader from "./Components/ChatScreenHeader"

export default function ChatScreen1({ navigation }) {
  const [chatUser] = useState({
    name: "Robert Henry",
    profile_image: "https://randomuser.me/api/portraits/men/0.jpg",
    last_seen: "online",
  })

  const [currentUser] = useState({
    name: "John Doe",
  })

  const [messages, setMessages] = useState([
    { sender: "John Doe", message: "Hey there!", time: "6:01 PM" },
    {
      sender: "Robert Henry",
      message: "Hello, how are you doing?",
      time: "6:02 PM",
    },
    {
      sender: "John Doe",
      message: "I am good, how about you?",
      time: "6:02 PM",
    },
    {
      sender: "John Doe",
      message: "😊😇",
      time: "6:02 PM",
    },
    {
      sender: "Robert Henry",
      message: "Can't wait to meet you.",
      time: "6:03 PM",
    },
    {
      sender: "John Doe",
      message: "That's great, when are you coming?",
      time: "6:03 PM",
    },
    {
      sender: "Robert Henry",
      message: "This weekend.",
      time: "6:03 PM",
    },
    {
      sender: "Robert Henry",
      message: "Around 4 to 6 PM.",
      time: "6:04 PM",
    },
    {
      sender: "John Doe",
      message: "Great, don't forget to bring me some mangoes.",
      time: "6:05 PM",
    },
    {
      sender: "Robert Henry",
      message: "Sure!",
      time: "6:05 PM",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")

  function getTime(date: Date) {
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes : minutes
    var strTime = hours + ":" + minutes + " " + ampm
    return strTime
  }

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("")
    }
    let t = getTime(new Date())
    setMessages([
      ...messages,
      {
        sender: currentUser.name,
        message: inputMessage,
        time: t,
      },
    ])
    setInputMessage("")
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <ChatScreenHeader />
        <View style={styles.container}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
              height: 30,
              width: 96,
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                color: "#707070",
                fontSize: 12,
              }}
            >
              09 Oct 2021
            </Text>
          </View>
          <View
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
          >
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                color: "#707070",
                fontSize: 12,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Justo nec
              felis magna et sed mperdiet congue magna et nunc auctor.
            </Text>
          </View>
          <FlatList
            style={{ backgroundColor: "#3970AA" }}
            inverted={true}
            data={JSON.parse(JSON.stringify(messages)).reverse()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback>
                <View style={{ marginTop: 6 }}>
                  <View
                    style={{
                      maxWidth: Dimensions.get("screen").width * 0.8,
                      backgroundColor: "#f8f8f8",
                      alignSelf:
                        item.sender === currentUser.name
                          ? "flex-end"
                          : "flex-start",
                      marginHorizontal: 10,
                      padding: 10,
                      borderLeftWidth: item.sender === currentUser.name ? 0 : 5,
                      borderLeftColor:
                        item.sender === currentUser.name && "#45c359",
                      borderRightWidth:
                        item.sender === currentUser.name ? 5 : 0,
                      borderRightColor:
                        item.sender === currentUser.name && "#4582c3",
                    }}
                  >
                    <Text
                      style={{
                        color: "#383838",
                        fontSize: 13,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {item.message}
                    </Text>
                    <Text
                      style={{
                        color: "#707070",
                        fontSize: 11,
                        alignSelf: "flex-end",
                      }}
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
          <View
            style={{
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.messageInputView}>
              <Feather
                style={{ paddingLeft: 10 }}
                color={"#999999"}
                name="smile"
                size={24}
              />
              <TextInput
                defaultValue={inputMessage}
                style={styles.messageInput}
                placeholder="Message"
                onChangeText={(text) => setInputMessage(text)}
                onSubmitEditing={() => sendMessage()}
              />
              <Entypo
                style={{ paddingLeft: 10 }}
                size={22}
                name="attachment"
                color={"#999999"}
              />
              <TouchableOpacity
                style={styles.messageSendView}
                onPress={() => sendMessage()}
              >
                <Icon name="send" type="material" />
              </TouchableOpacity>
            </View>
            <Entypo name="camera" size={24} color={"#999999"} />
            <View
              style={{
                backgroundColor: "#4582c3",
                height: 37,
                width: 37,
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Ionicons name="mic-outline" size={30} color={"#fff"} />
            </View>
          </View>
        </View>
      </>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3970AA",
  },
  messageInputView: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
  },
  messageInput: {
    height: 50,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
})
