import { View } from "react-native";
import React from "react";
// import moment from "moment";
import { MessageInterface } from "../../../../modals";
// import { Timestamp } from "firebase/firestore";
import { useStyles } from "./styles";
// import Text from "../../../../components/Text";
import { Audio } from "expo-av";
import { useGroupState } from "../../../../slices/groupSlice";
import { useUserState } from "../../../../slices/userSlice";
import { Appbar, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import Slider from "@react-native-community/slider";

const ChatAudioMessage = (props: MessageInterface) => {
  const GroupState = useGroupState();
  // const UserState = useUserState();

  const [sound, setSound] = React.useState<Audio.Sound>();

  const [audioPlayback, setAudioPlayback] = React.useState("Not Playing");

  const [sliderColor, setSliderColor] = React.useState("#45C000");

  const changeColor = () => {
    setSliderColor("#4582c3");
  };

  // const color = GroupState?.members.find(
  //   (member) => member.uid === props.senderId,
  // )?.color;

  // const styles = useStyles(color);

  // const TypeOfMessage =
  //   UserState.phoneNumber === props.senderId
  //     ? {
  //       message: styles.sender,
  //       timestamp: styles.senderTimestamp,
  //     }
  //     : {
  //       message: styles.receiver,
  //       timestamp: styles.receiverTimestamp,
  //     };

  const playSound = async () => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({
      uri: props.message,
    });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  };

  React.useEffect(() => {
    return sound
      ? () => {
        console.log("Unloading Sound");
        setAudioPlayback("Not Playing");
      }
      : undefined;
  }, [sound]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      { audioPlayback === "Not Playing" ? (
        <Appbar.Action
          icon={"play"}
          size={30}
          color="#4582c3"
          onPress={() => {setAudioPlayback("Playing"); playSound();}}
          style={{
            margin: 0,
            padding: 0,
            marginRight: -15,
          }}
        />) : (<Appbar.Action
        icon={"pause"}
        size={30}
        color="#4582c3"
        onPress={() => {setAudioPlayback("Not Playing");}}
        style={{
          margin: 0,
          padding: 0,
          marginRight: -15,
        }}
      />)}
      {/* <Button
        // onPress={() => Linking.openURL(item.message)}
        // icon="file"
        uppercase={false}
        contentStyle={{
          overflow: "hidden",
          padding: 0,
          margin: 0,
        }}
        style={{ margin: 0, padding: 0 }}
        labelStyle={{
          color: "#707070",
          fontFamily: "Poppins_500Medium",
        }}
      >
      </Button> */}
      <View>
        <Slider
          style={{width: 108, height: 40, marginLeft: 7}}
          minimumValue={50}
          maximumValue={100}
          minimumTrackTintColor="#707070"
          maximumTrackTintColor="#000000"
          thumbTintColor={sliderColor}
          onSlidingStart={changeColor}
        />
      </View>
      <Ionicons
        name="mic"
        size={20}
        color={"#4582c3"}
        style={{ marginLeft: 1.5 }}
      />
    </View>
  );
};

export default ChatAudioMessage;
