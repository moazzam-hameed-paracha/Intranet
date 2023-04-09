import { View } from "react-native";
import React from "react";
import { Audio } from "expo-av";
import { Appbar, Button, FAB } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import Slider from "@react-native-community/slider";

const ChatAudioMessage = (props: any) => {
  //const duration = props.duration.split(":").pop();
  const [sound, setSound] = React.useState<Audio.Sound>();

  const [audioPlayback, setAudioPlayback] = React.useState("Not Playing");

  const playSound = async () => {
    console.log("Loading Sound");
    setAudioPlayback("Loading");
    const { sound } = await Audio.Sound.createAsync({
      uri: props.message,
    });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync().then(() => {
      setAudioPlayback("Playing");
    });
    sound._onPlaybackStatusUpdate = (playbackStatus) => {
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        setAudioPlayback("Not Playing");
      }
    };
  };

  React.useEffect(() => {
    return sound
      ? () => {
          setAudioPlayback("Not Playing");
          console.log("Unloading Sound");
          console.log(audioPlayback);
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
      {audioPlayback === "Not Playing" ? (
        <Button
          icon={"play"}
          loading={false}
          onPress={() => {
            setAudioPlayback("Playing");
            playSound();
          }}
          style={{
            marginVertical: 5,
            backgroundColor: "#4582c3",
            borderRadius: 25,
          }}
          labelStyle={{ fontFamily: "Poppins_400Regular", color: "white" }}
        >
          Play Audio
        </Button>
      ) : audioPlayback === "Loading" ? (
        <Button
          icon={"play"}
          loading={true}
          onPress={() => {
            setAudioPlayback("Not Playing");
          }}
          style={{
            marginVertical: 5,
            backgroundColor: "#4582c3",
            borderRadius: 25,
          }}
          labelStyle={{ fontFamily: "Poppins_400Regular", color: "white" }}
        >
          Loading Audio
        </Button>
      ) : (
        <Button
          icon={"pause"}
          loading={false}
          onPress={() => {
            setAudioPlayback("Not Playing");
          }}
          style={{
            marginVertical: 5,
            backgroundColor: "#4582c3",
            borderRadius: 25,
          }}
          labelStyle={{ fontFamily: "Poppins_400Regular", color: "white" }}
        >
          Playing Audio
        </Button>
      )}
    </View>
  );
};

export default ChatAudioMessage;
