import { View } from "react-native";
import React from "react";
import moment from "moment";
import { MessageInterface } from "../../../../modals";
import { Timestamp } from "firebase/firestore";
import { useStyles } from "./styles";
import Text from "../../../../components/Text";
import { extractFilenameFromUrl } from "../../../../utils/extractFilenameFromUrl";
import { Button } from "react-native-paper";
import { useGroupState } from "../../../../slices/groupSlice";
import { useUserState } from "../../../../slices/userSlice";

import * as Linking from "expo-linking";

const ChatDocMessage = (props: MessageInterface) => {
  const UserState = useUserState();
  const GroupState = useGroupState();

  const color = GroupState?.members.find(
    (member) => member.uid === props.senderId,
  )?.color;

  const styles = useStyles(color);

  const TypeOfMessage =
    UserState.phoneNumber === props.senderId
      ? { message: styles.sender, timestamp: styles.senderTimestamp }
      : { message: styles.receiver, timestamp: styles.receiverTimestamp };

  const handleDownloadDocument = (uri: string) => {
    Linking.openURL(uri)
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View>
      <View style={[styles.message, TypeOfMessage.message]}>
        <Text variant="p">{extractFilenameFromUrl(props.message)}</Text>
        <Button onPress={() => handleDownloadDocument(props.message)}>
          Download
        </Button>
        <Text style={[styles.timestamp, TypeOfMessage.timestamp]}>
          {props.timestamp
            ? moment((props.timestamp as Timestamp).toDate()).format("LT")
            : "..."}
        </Text>
      </View>
    </View>
  );
};

export default ChatDocMessage;
