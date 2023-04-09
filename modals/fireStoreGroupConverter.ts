import { DocumentData } from "firebase/firestore";
import { GroupMember } from "./fireStoreGroupMemberConverter";

// eslint-disable-next-line no-unused-vars
enum GroupLevel {
  // eslint-disable-next-line no-unused-vars
  MANAGERIAL = "managerial",
  // eslint-disable-next-line no-unused-vars
  DEPARTMENTAL = "departmental",
  // eslint-disable-next-line no-unused-vars
  OUTSOURCING = "outsourcing",
  // eslint-disable-next-line no-unused-vars
  TEMPORARY = "temporary",
  // eslint-disable-next-line no-unused-vars
  INDIVIDUAL = "individual",
}

class Group {
  uid: string;
  name: string;
  photo: string;
  level: GroupLevel;
  members: GroupMember[];

  constructor(
    uid: string,
    name: string,
    photo: string,
    level: GroupLevel,
    members: GroupMember[],
  ) {
    this.uid = uid;
    this.name = name;
    this.photo = photo;
    this.level = level;
    this.members = members;
  }
}

const fireStoreGroupConverter = {
  toFirestore(group: Group): DocumentData {
    return group;
  },
  fromFirestore(snapshot, options): Group {
    const data = snapshot.data(options)! as Group;
    return new Group(
      data.uid,
      data.name,
      data.photo,
      data.level,
      data.members,
    );
  },
};

export { fireStoreGroupConverter, Group, GroupLevel };
