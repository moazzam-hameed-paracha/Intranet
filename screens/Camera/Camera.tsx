import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import useChatInput from "../Chat/hooks/useChatInput";
import { Camera as ExpoCamera } from "expo-camera";
import { Button, FAB } from "react-native-paper";
import { Pages } from "../../Pages";
import Text from "../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import { SafeAreaView } from "react-native-safe-area-context";
const Camera = (props) => {
  const { handleSendPictureMessage, cameraRef, hasCameraPermission } =
    useChatInput();

  const [cameraType, setCameraType] = useState("back");
  const toggleFrontCamera = () => setCameraType("front");
  const toggleBackCamera = () => setCameraType("back");
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ExpoCamera
        ref={cameraRef}
        style={{
          height: getScreenPercentageSize(100).height,
        }}
        type={cameraType}
        ratio="16:9"
      >
        <View
          style={{
            marginTop: getScreenPercentageSize(83).height,
            flex: 1,
            flexDirection: "row",
          }}
        >
          {cameraType === "back" ? (
            <View
              style={{
                flexDirection: "column",
                width: "33%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FAB
                icon="camera-switch"
                color="white"
                style={{
                  backgroundColor: "#303030",
                }}
                onPress={toggleFrontCamera}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                width: "33%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FAB
                icon="camera-switch"
                color="white"
                style={{
                  backgroundColor: "#303030",
                }}
                onPress={toggleBackCamera}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              width: "33%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <FAB
              icon="checkbox-blank-circle"
              color="red"
              onPress={() => {
                handleSendPictureMessage().then(() => {
                  handleBack();
                });
              }}
            /> */}
            <TouchableOpacity
              style={{
                width: "45%",
                height: "45%",
                backgroundColor: "#303030",
                borderRadius: 50,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handleSendPictureMessage().then(() => {
                    navigation.goBack();
                  });
                }}
                style={{
                  width: "70%",
                  height: "70%",
                  backgroundColor: "white",
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              ></TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "33%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FAB
              icon="close-thick"
              color="white"
              style={{ backgroundColor: "#303030" }}
              onPress={handleBack}
            />
          </View>
        </View>
      </ExpoCamera>
    </SafeAreaView>
  );
};

export default Camera;
