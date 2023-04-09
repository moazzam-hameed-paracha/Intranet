import { db } from "../firebase";

// Add a new document in collection "messages" - used to send messages using firebase through Twilio
const sendSMS = async (to: string, body: string) => {
  const res = await db.collection("sms").add({
    to: to,
    body: body,
  });
  console.log("sendSMS response: " + res);
};

export default sendSMS;
