import { db, firebase } from "../firebase";
import {
  fireStoreUserConverter,
  GroupMemberPrivilege,
  UserInterface,
  UserStatus,
} from "../modals";
import { convertedPhoneNumber } from "../utils/convertedPhoneNumber";
import { DefaultImages, getDefaultImages } from "../utils/getDefaultImages";

const useUserFirebaseActions = () => {
  // create function to add user to firebase
  const addUser = async (user: UserInterface) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { userRef: firebase.firestore.DocumentReference<UserInterface> } =
      null;

    try {
      let newUser = { ...user };
      if (user.photoURL !== null) {
        // eslint-disable-next-line no-undef
        const response = await fetch(user.photoURL);
        const blob = await response.blob();
        const snapshot = await firebase
          .storage()
          .ref()
          .child(
            "users/" + user.phoneNumber + "/profile." + blob.type.split("/")[1],
          )
          .put(blob);
        const photoUrl = await snapshot.ref.getDownloadURL();
        newUser = { ...newUser, photoURL: photoUrl };
      } else {
        const defaultImage = await getDefaultImages(
          DefaultImages.PROFILE_IMAGE,
        );
        // console.log("defaultImage", defaultImage);
        newUser = { ...newUser, photoURL: defaultImage[0] };
      }

      db.collection("users")
        .withConverter(fireStoreUserConverter)
        .doc(newUser.phoneNumber)
        .set(newUser);

      data = {
        userRef: await db
          .collection("users")
          .withConverter(fireStoreUserConverter)
          .doc(newUser.phoneNumber),
      };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // create function update user
  const updateUser = async (user: {
    phoneNumber: string;
    displayName?: string;
    photoURL?: string;
    privilege?: GroupMemberPrivilege | null;
    status?: UserStatus;
    designation?: string;
    notificationToken?: string;
  }) => {
    let success = true;
    let error: firebase.FirebaseError = null;

    try {
      let updatedUser = { ...user };

      if (user.photoURL) {
        const oldPhoto = (await getUser(user.phoneNumber)).data.user.data()
          .photoURL;

        if (oldPhoto.length > 0) {
          firebase.storage().refFromURL(oldPhoto).delete();
        }

        // eslint-disable-next-line no-undef
        const response = await fetch(user.photoURL);
        const blob = await response.blob();
        const snapshot = await firebase
          .storage()
          .ref()
          .child(
            "users/" + user.phoneNumber + "/profile." + blob.type.split("/")[1],
          )
          .put(blob);

        const photoURL = await snapshot.ref.getDownloadURL();

        updatedUser = { ...user, photoURL };
      }

      db.collection("users")
        .withConverter(fireStoreUserConverter)
        .doc(user.phoneNumber)
        .update(updatedUser);
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error };
  };

  // delete user
  const deleteUser = async (uid: string) => {
    let success = true;
    let error: firebase.FirebaseError = null;

    try {
      db.collection("users").doc(uid).delete();
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error };
  };

  // get user by uid
  const getUser = async (uid: string) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { user: firebase.firestore.DocumentSnapshot<UserInterface> } =
      null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .doc(uid)
        .get();

      data = { user: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // get all users
  const getUsers = async () => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { users: firebase.firestore.QuerySnapshot<UserInterface> } = null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .get();

      data = { users: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // get admins
  const getAdmins = async () => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { users: firebase.firestore.QuerySnapshot<UserInterface> } = null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("isAdmin", "==", true)
        .get();

      data = { users: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // get CEO
  const getCEO = async () => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { users: firebase.firestore.QuerySnapshot<UserInterface> } = null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("designation", "==", "CEO")
        .get();

      data = { users: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // get user by phone number using async await
  const getUserByPhoneNumber = async (phoneNumber: string) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { user: firebase.firestore.QuerySnapshot<UserInterface> } = null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("phoneNumber", "==", convertedPhoneNumber(phoneNumber))
        .get();

      data = { user: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // get user by member designations
  const getUsersByMemberDesignations = async (designations: string[]) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { users: firebase.firestore.QuerySnapshot<UserInterface> } = null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("designations", "==", designations)
        .get();

      data = { users: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  // get user by ids
  const getUsersByIds = async (ids: string[]) => {
    let success = true;
    let error: firebase.FirebaseError = null;
    let data: { users: firebase.firestore.QuerySnapshot<UserInterface> } = null;

    try {
      const querySnapshot = await db
        .collection("users")
        .withConverter(fireStoreUserConverter)
        .where("uid", "in", ids)
        .get();

      data = { users: querySnapshot };
    } catch (err) {
      success = false;
      error = err;
    }

    return { success, error, data };
  };

  return {
    addUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    getUsersByMemberDesignations,
    getAdmins,
    getCEO,
    getUsersByIds,
    getUserByPhoneNumber,
  };
};

export default useUserFirebaseActions;
