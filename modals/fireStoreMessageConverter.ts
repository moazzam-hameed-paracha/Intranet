import { DocumentData, FieldValue } from "firebase/firestore";
import { GroupMemberPrivilege } from "./fireStoreGroupMemberConverter";

// eslint-disable-next-line no-unused-vars
enum MessageTypes {
  // eslint-disable-next-line no-unused-vars
  TEXT = "text",
  // eslint-disable-next-line no-unused-vars
  IMAGE = "image",
  // eslint-disable-next-line no-unused-vars
  AUDIO = "audio",
  // eslint-disable-next-line no-unused-vars
  DOCUMENT = "document",
  // eslint-disable-next-line no-unused-vars
  FORWARD = "forward",
  // eslint-disable-next-line no-unused-vars
  REPLY = "reply",
}

class Message {
  uid: string;
  senderId: string;
  message: string;
  type: MessageTypes;
  privilege: GroupMemberPrivilege;
  timestamp: FieldValue;
  duration: string;
  verifiedUsers: string[];

  constructor(
    uid: string,
    senderId: string,
    message: string,
    type: MessageTypes,
    privilege: GroupMemberPrivilege,
    timestamp: FieldValue,
    duration: string,
    verifiedUsers: string[],
  ) {
    this.uid = uid;
    this.senderId = senderId;
    this.message = message;
    this.type = type;
    this.privilege = privilege;
    this.timestamp = timestamp;
    this.duration = duration;
    this.verifiedUsers = verifiedUsers;
  }
}

const fireStoreMessageConverter = {
  toFirestore(message: Omit<Message, "uid">): DocumentData {
    return message;
  },
  fromFirestore(snapshot, options): Message {
    const data = snapshot.data(options)! as Message;
    return new Message(
      data.uid,
      data.senderId,
      data.message,
      data.type,
      data.privilege,
      data.timestamp,
      data.duration,
      data.verifiedUsers,
    );
  },
};

export { Message, MessageTypes, fireStoreMessageConverter };
