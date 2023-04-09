import { DocumentData } from "firebase/firestore";
import { fireStoreUserConverter, User, UserStatus } from "./fireStoreUserConverter";
import { firebase } from "../firebase";

// eslint-disable-next-line no-unused-vars
enum GroupMemberPrivilege {
  // eslint-disable-next-line no-unused-vars
  CEO = "ceo",
  // eslint-disable-next-line no-unused-vars
  OWNER = "owner",
  // eslint-disable-next-line no-unused-vars
  GROUP_LEAD = "group-lead",
  // eslint-disable-next-line no-unused-vars
  CO_LEAD = "co-lead",
  // eslint-disable-next-line no-unused-vars
  USER = "user",
}

class GroupMember {
  uid: string;
  user: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  processedUser?: User;
  color: string;
  privilege: GroupMemberPrivilege;

  constructor(
    uid: string,
    user: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
    color: string,
    privilege: GroupMemberPrivilege,
  ) {
    this.uid = uid;
    this.user = user;
    this.processedUser = new User("Loading...", "Loading...", "", "Loading...", false, UserStatus.ACTIVE);
    this.color = color;
    this.privilege = privilege;
  }
}

const fireStoreGroupMemberConverter = {
  toFirestore(groupMember): DocumentData {
    return groupMember;
  },
  fromFirestore(snapshot, options): GroupMember {
    const data = snapshot.data(options)! as GroupMember;
    const user = data.user.withConverter(fireStoreUserConverter);

    return new GroupMember(data.uid, user, data.color, data.privilege);
  },
};

export { GroupMember, GroupMemberPrivilege, fireStoreGroupMemberConverter };
