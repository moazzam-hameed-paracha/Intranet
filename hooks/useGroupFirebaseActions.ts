import { db, firebase } from "../firebase";
import { serverTimestamp } from "firebase/firestore";
import useUserFirebaseActions from "./useUserFirebaseActions";

import { generateColors } from "../utils/generateRandomColor";

import { Omit, uniqBy } from "lodash";
import {
  fireStoreGroupConverter,
  fireStoreMessageConverter,
  fireStoreUserConverter,
  GroupInterface,
  GroupLevel,
  GroupMemberInterface,
  GroupMemberPrivilege,
  MessageInterface,
  UserInterface,
} from "../modals";
import { convertedPhoneNumber } from "../utils/convertedPhoneNumber";
import { DefaultImages, getDefaultImages } from "../utils/getDefaultImages";

const useGroupFirebaseActions = () => {
  const { getAdmins, getUser } = useUserFirebaseActions();

  const createGroup = async (
    group: Omit<GroupInterface, "uid" | "members">,
    _owner: string,
  ) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: {
      groupRef: firebase.firestore.DocumentReference<GroupInterface>;
    } = null;

    try {
      const groupRef = await db
        .collection("groups")
        .withConverter(fireStoreGroupConverter)
        .add({ ...group, members: [], uid: "" });

      let photoUrl = "";
      if (group.photo !== null && group.photo.length > 0) {
        // eslint-disable-next-line no-undef
        const response = await fetch(group.photo);
        const blob = await response.blob();
        const snapshot = await firebase
          .storage()
          .ref()
          .child("groups/" + groupRef.id + "/photo." + blob.type.split("/")[1])
          .put(blob);

        photoUrl = await snapshot.ref.getDownloadURL();
      } else {
        const defaultImage = await getDefaultImages(DefaultImages.GROUP_IMAGE);

        photoUrl = defaultImage[0];
      }

      const admins = await getAdmins();

      if (admins.error !== null) {
        throw admins.error;
      }

      const owner = await getUser(_owner);

      if (owner.error !== null) {
        throw owner.error;
      }

      const members = [...admins.data.users.docs, owner.data.user];

      const userColors = generateColors(admins.data.users.size);

      const groupMembers: GroupMemberInterface[] = members.map(
        (member, index) => {
          const userRef = db
            .collection("users")
            .withConverter(fireStoreUserConverter)
            .doc(member.id);

          return {
            uid: member.id,
            user: userRef,
            color: userColors[index],
            privilege:
              member.id === owner.data.user.id
                ? GroupMemberPrivilege.OWNER
                : GroupMemberPrivilege.CEO,
          };
        },
      );
      group.members.forEach((m) => {
        console.log(m.uid);
        if (groupMembers.filter((v) => v.uid == m.uid).length == 0) {
          const userRef = db
            .collection("users")
            .withConverter(fireStoreUserConverter)
            .doc(m.uid);

          groupMembers.push({
            uid: m.uid,
            user: userRef,
            color: m.color,
            privilege: m.privilege,
          });
        }
      });

      groupRef.update({
        photo: photoUrl,
        members: groupMembers,
        uid: groupRef.id,
      });

      data = { groupRef };
    } catch (err) {
      error = err;
      success = false;
      data = null;
    }
    return { error, success, data };
  };

  const createDirectChat = async (toPhone, fromPhone) => {
    let toUser = (
      await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("phoneNumber", "==", convertedPhoneNumber(toPhone))
        .get()
    ).docs[0];
    let fromUser = (
      await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("phoneNumber", "==", convertedPhoneNumber(fromPhone))
        .get()
    ).docs[0];
    const userColors = generateColors(2);

    const groupMembers: GroupMemberInterface[] = [toUser, fromUser].map(
      (user, index) => {
        const userRef = db
          .collection("users")
          .withConverter(fireStoreUserConverter)
          .doc(user.id);

        return {
          uid: user.id,
          user: userRef,
          color: userColors[index],
          privilege: GroupMemberPrivilege.USER,
        };
      },
    );
    let groupRef = await db
      .collection("groups")
      .withConverter(fireStoreGroupConverter)
      .add({
        name: `${toUser.id}_${fromUser.id}`,
        members: groupMembers,
        uid: "",
        level: GroupLevel.INDIVIDUAL,
        photo: "",
      });
    await groupRef.update({
      uid: groupRef.id,
    });
    return groupRef;
  };

  const updateGroup = async (group: {
    uid: string;
    name?: string;
    photo?: string;
    level?: GroupLevel;
    members?: Omit<GroupMemberInterface, "color">[];
  }) => {
    let success = true;
    let error: firebase.FirebaseError = null;

    try {
      let _group = group;

      const currentGroup = await getGroup(group.uid);

      if (currentGroup.error !== null) {
        throw currentGroup.error;
      }

      if (group.photo) {
        // removing old photo
        firebase
          .storage()
          .refFromURL(currentGroup.data.group.data().photo)
          .delete();

        // eslint-disable-next-line no-undef
        const response = await fetch(group.photo);
        const blob = await response.blob();
        const snapshot = await firebase
          .storage()
          .ref()
          .child("groups/" + group.uid + "/photo." + blob.type.split("/")[1])
          .put(blob);

        const photoUrl = await snapshot.ref.getDownloadURL();
        _group = { ...group, photo: photoUrl };
      }

      if (group.members) {
        const vitalMembers = currentGroup.data.group
          .data()
          .members.filter(
            (member) =>
              member.privilege === GroupMemberPrivilege.CEO ||
              member.privilege === GroupMemberPrivilege.OWNER,
          );

        const excludeColors = vitalMembers.map((member) => member.color);
        const userColors = generateColors(group.members.length, excludeColors);

        const groupMembers: GroupMemberInterface[] = group.members.map(
          (member, index) => {
            return {
              ...member,
              color: userColors[index],
            };
          },
        );

        const newGroupMembers = uniqBy(
          [...vitalMembers, ...groupMembers],
          "uid",
        );

        _group = { ...group, members: newGroupMembers };
      }

      db.collection("groups").doc(group.uid).update(_group);
    } catch (err) {
      error = err;
      success = false;
    }
    return await { error, success };
  };

  const addMemberToGroup = async ({
    groupId,
    userId,
    privilege = GroupMemberPrivilege.USER,
  }: {
    groupId: string;
    userId: string;
    privilege?: GroupMemberPrivilege;
  }) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: {
      member: {
        uid: string;
        user: firebase.firestore.DocumentReference<UserInterface>;
        privilege: GroupMemberPrivilege;
        color: string;
      };
    } = null;

    try {
      const userRef = db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .doc(userId);

      // get all members colors
      const members = (
        (
          await db
            .collection("groups")
            .withConverter(fireStoreGroupConverter)
            .doc(groupId)
            .get()
        ).data() as GroupInterface
      ).members;

      const excludeColors: string[] = [];

      let userAlreadyExists = false;
      members.forEach((member) => {
        if (member.uid === userRef.id) userAlreadyExists = true;

        excludeColors.push(member.color);
      });

      if (userAlreadyExists) throw new Error("USER ALREADY EXISTS");

      const memberColor = generateColors(members.length + 1, excludeColors);

      const newMember = {
        uid: userRef.id,
        user: userRef,
        privilege: privilege,
        color: memberColor.pop(),
      };

      // add new member to group members array
      db.collection("groups")
        .withConverter(fireStoreGroupConverter)
        .doc(groupId)
        .update({
          members: [...members, newMember],
        });

      data = { member: newMember };
    } catch (err) {
      error = err;
      success = false;
    }
    return await { error, success, data };
  };

  const getGroup = async (uid: string) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { group: firebase.firestore.DocumentSnapshot<GroupInterface> } =
      null;

    try {
      const group = await db
        .collection("groups")
        .withConverter(fireStoreGroupConverter)
        .doc(uid)
        .get();

      if (!group.exists) throw new Error("GROUP DOES NOT EXIST");

      data = { group };
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success, data };
  };

  const getGroupsByMemberIds = async (ids: string[]) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: {
      groups: firebase.firestore.QueryDocumentSnapshot<GroupInterface>[];
    } = null;

    try {
      const groups = await db
        .collection("groups")
        .withConverter(fireStoreGroupConverter)
        .get();

      const memberGroups = groups.docs.filter((group) => {
        const members = group.data().members;
        return members.some((member) => ids.includes(member.uid));
      });

      data = { groups: memberGroups };
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success, data };
  };

  const getGroupsByIds = async (ids: string[]) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { groups: firebase.firestore.QuerySnapshot<GroupInterface> } =
      null;

    try {
      const groups = await db
        .collection("groups")
        .withConverter(fireStoreGroupConverter)
        .where("uid", "in", ids)
        .get();

      data = { groups };
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success, data };
  };

  const getGroups = async () => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { groups: firebase.firestore.QuerySnapshot<GroupInterface> } =
      null;

    try {
      const groups = await db
        .collection("groups")
        .withConverter(fireStoreGroupConverter)
        .get();
      data = { groups };
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success, data };
  };

  const removeMemberFromGroup = async ({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) => {
    let success = true;
    let error: firebase.FirebaseError = null;

    try {
      const members = await (await getGroup(groupId)).data.group.data().members;

      const removedMember = members.find((member) => member.uid === userId);

      if (removedMember === undefined) throw new Error("USER NOT FOUND");

      if (removedMember.privilege === GroupMemberPrivilege.CEO)
        throw new Error("CANNOT REMOVE CEO");

      if (removedMember.privilege === GroupMemberPrivilege.OWNER)
        throw new Error("CANNOT REMOVE OWNER");

      const newMembers = members.filter((member) => member.uid !== userId);

      updateGroup({ uid: groupId, members: newMembers });
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success };
  };

  const addMessageToGroup = async (
    groupId: string,
    message: Omit<MessageInterface, "uid">,
    filename?: string,
  ) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: {
      messageRef: firebase.firestore.DocumentReference<MessageInterface>;
    } = null;
    try {
      const messageRef = db
        .collection("groups")
        .doc(groupId)
        .collection("messages")
        .withConverter(fireStoreMessageConverter)
        .doc();

      let newMessage = { ...message, uid: messageRef.id };

      if (message.type !== "text") {
        // eslint-disable-next-line no-undef
        const response = await fetch(message.message);
        const blob = await response.blob();
        const snapshot = await firebase
          .storage()
          .ref()
          .child(
            "groups/" + groupId + "/messages/" + messageRef.id + "/" + filename,
          )
          .put(blob);

        const messageUrl = await snapshot.ref.getDownloadURL();
        newMessage = {
          ...newMessage,
          message: messageUrl,
          timestamp: serverTimestamp(),
        };
      }
      messageRef.set(newMessage);

      data = {
        messageRef: messageRef,
      };
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success, data };
  };

  const removeMessageFromGroup = async ({
    groupId,
    messageId,
    fileUrl = "",
    deleteFileFromStorage = false,
  }: {
    groupId: string;
    messageId: string;
    fileUrl: string;
    deleteFileFromStorage: boolean;
  }) => {
    let success = true;
    let error: firebase.FirebaseError = null;

    try {
      if (fileUrl !== "" && deleteFileFromStorage) {
        firebase.storage().refFromURL(fileUrl).delete();
      }

      db.collection("groups")
        .doc(groupId)
        .collection("messages")
        .doc(messageId)
        .delete();
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success };
  };

  const deleteGroup = async (groupId: string) => {
    let success = true;
    let error: firebase.FirebaseError = null;

    try {
      db.collection("groups").doc(groupId).delete();
    } catch (err) {
      error = err;
      success = false;
    }

    return { error, success };
  };

  return {
    createGroup,
    createDirectChat,
    updateGroup,
    addMemberToGroup,
    getGroup,
    getGroupsByMemberIds,
    getGroups,
    getGroupsByIds,
    removeMemberFromGroup,
    deleteGroup,
    addMessageToGroup,
    removeMessageFromGroup,
  };
};

export default useGroupFirebaseActions;
