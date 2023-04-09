import { Image, View } from "react-native";
import React from "react";
import moment from "moment";
import { MessageInterface } from "../../../../modals";
import { Timestamp } from "firebase/firestore";
import { useStyles } from "./styles";
import Text from "../../../../components/Text";
import { getScreenPercentageSize } from "../../../../utils/getScreenPercentageSize";
import { useUserState } from "../../../../slices/userSlice";
import { useGroupState } from "../../../../slices/groupSlice";

const ChatImageMessage = (props: MessageInterface) => {
  
  const GroupState = useGroupState();
  const UserState = useUserState();

  const color = GroupState?.members.find(
    (member) => member.uid === props.senderId,
  )?.color;

  const styles = useStyles(color);

  const TypeOfMessage =
    UserState.phoneNumber === props.senderId
      ? { message: styles.sender, timestamp: styles.senderTimestamp }
      : { message: styles.receiver, timestamp: styles.receiverTimestamp };

  return (
    <View>
      <View style={[styles.message, TypeOfMessage.message]}>
        <Image
          source={{
            uri: props.message,
            width: getScreenPercentageSize(40).width,
            height: getScreenPercentageSize(40).height,
          }}
        />
        <Text style={[styles.timestamp, TypeOfMessage.timestamp]}>
          {props.timestamp
            ? moment((props.timestamp as Timestamp).toDate()).format("LT")
            : "..."}
        </Text>
      </View>
    </View>
  );
};

export default ChatImageMessage;
