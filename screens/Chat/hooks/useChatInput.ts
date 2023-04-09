import { Audio } from "expo-av";
import { serverTimestamp } from "firebase/firestore";
import React from "react";
import * as DocumentPicker from "expo-document-picker";
import { GroupMemberPrivilege, MessageTypes } from "../../../modals";
import {
  Camera,
  CameraCapturedPicture,
  CameraPictureOptions,
} from "expo-camera";
import { useGroupState } from "../../../slices/groupSlice";
import { useUserState } from "../../../slices/userSlice";
import useGroupFirebaseActions from "../../../hooks/useGroupFirebaseActions";

export default function useChatInput() {
  const GroupState = useGroupState();
  const UserState = useUserState();

  const GroupFirebaseActions = useGroupFirebaseActions();

  const cameraRef = React.useRef(null);

  const [message, setMessage] = React.useState("");
  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);
  const [recording, setRecording] = React.useState<Audio.Recording>();

  // Audio
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const { status } = await recording.createNewLoadedSoundAsync();
    console.log("Stopping recording..");
    const uri = recording.getURI();
    //console.log("Recording stopped and stored at", uri);
    console.log("This is the recording : ",recording);
    //const duration = getDurationFormatted()
    GroupFirebaseActions.addMessageToGroup(GroupState.uid, {
      message: uri,
      senderId: UserState.phoneNumber,
      privilege: GroupMemberPrivilege.USER,
      timestamp: serverTimestamp(),
      type: MessageTypes.AUDIO,
      duration:getDurationFormatted(status.durationMillis),
      verifiedUsers: [],
    }, ).then((res) => {
      console.log(res);
      if (res.success) {
        setMessage("");
      }
    });
  };

  const handleSendAudioMessage = () => {
    return recording ? stopRecording() : startRecording();
  };

  const renderAudioButtonText = recording
    ? "Stop Recording"
    : "Start Recording";

  // text
  const handleSendTextMessage = () => {
    console.log("Sending text message..", message);
    if (message.trim().length > 0) {
      GroupFirebaseActions.addMessageToGroup(GroupState.uid, {
        message: message,
        senderId: UserState.phoneNumber,
        privilege: GroupMemberPrivilege.USER,
        timestamp: serverTimestamp(),
        type: MessageTypes.TEXT,
        duration: "null",
        verifiedUsers: [],
      }).then((res) => {
        console.log(res.success);
        if (res.success) {
          setMessage("");
        }
      });
    }
  };

  function formatBytes(bytes, decimals = 0) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // doc
  const handleSendDocumentMessage = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      console.log("Sending document..");
      console.log({ result });
      console.log({ "File Size is: " : result.size });
      console.log(formatBytes(result.size));
      const resp = await GroupFirebaseActions.addMessageToGroup(
        GroupState.uid,
        {
          message: result.uri,
          senderId: UserState.phoneNumber,
          privilege: GroupMemberPrivilege.USER,
          timestamp: serverTimestamp(),
          type: MessageTypes.DOCUMENT,
          duration:"null",
          verifiedUsers: [],
        },
        result.name,
      );

      if (resp.success) {
        console.log("Document sent");
      }
      if (resp.error) {
        console.log("Document failed to send");
      }
    }
  };

  // camera
  const handleSendPictureMessage = async () => {
    const options: CameraPictureOptions = {
      quality: 1,
      base64: true,
      exif: false,
    };

    const newPhoto = (await cameraRef?.current.takePictureAsync(
      options,
    )) as CameraCapturedPicture;

    console.log("Sending picture..");
    GroupFirebaseActions.addMessageToGroup(GroupState.uid, {
      message: newPhoto.uri,
      senderId: UserState.phoneNumber,
      privilege: GroupMemberPrivilege.USER,
      timestamp: serverTimestamp(),
      type: MessageTypes.IMAGE,
      duration: "null",
      verifiedUsers: [],
    }).then((res) => {
      console.log(res.success);
      if (res.success) {
        setMessage("");
      }
    });
  };

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  return {
    hasCameraPermission,
    message,
    setMessage,
    handleSendTextMessage,
    handleSendAudioMessage,
    stopRecording, startRecording,
    handleSendDocumentMessage,
    handleSendPictureMessage,
    renderAudioButtonText,
    cameraRef,
  };
}
