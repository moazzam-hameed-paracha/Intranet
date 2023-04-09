import {firebase} from "./../firebase";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const auth = firebase.auth();
const firestore = firebase.firestore();
const messagesRef = firestore.collection("messages");

const storage = getStorage();


export function uid() {
  return (auth.currentUser || {}).uid;
}

export const sendMessagetoFirebase = async (senderUID, receiverUID, photoURL, text, metaData) => {

  await messagesRef.add({
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    senderUID,
    receiverUID,
    conversationID: senderUID + receiverUID,
    photoURL,
    metaData
  });
};


export const uploadImage = async (file,childname) => {

  const storageRef = ref(storage, childname);

  const upload = await uploadBytes(storageRef, file);
  return await getDownloadURL(upload.ref);
};
  


