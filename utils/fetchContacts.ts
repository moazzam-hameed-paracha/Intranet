import * as Contacts from "expo-contacts";
import { db } from "../firebase";
import { User } from "../modals/fireStoreUserConverter";
import { ContactInterface } from "../slices/contactsSlice";
import { convertedPhoneNumber } from "./convertedPhoneNumber";

const fetchContacts = async (): Promise<ContactInterface[]> => {
    
  const { status } = await Contacts.requestPermissionsAsync();

  if (status !== "granted") {
    // Permission was denied...
    console.log("Permission was denied!");
    return [];
  }
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Emails, Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
  });

  if (data.length > 0) {
    let allContacts = data.flatMap((contact) : Promise<ContactInterface>[] => {
      return contact?.phoneNumbers?.map(async (phone) => {
        const foundUser = await userExists(phone.number);
        return {
          name: contact.name,
          phoneNumber: convertedPhoneNumber(phone.number),
          inSystem: foundUser.exists,
          user: foundUser.exists ? foundUser.user : null,
        };
      });
    });
    let resolvedContacts : ContactInterface[] = await Promise.all(allContacts);
    resolvedContacts.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
    return resolvedContacts;
  }
  return [];
};

const userExists = (phoneNumber):Promise<{exists: boolean, user: User | null}> => {
  return new Promise((resolve, reject) => {
    db.collection("users")
      .where("phoneNumber", "==", convertedPhoneNumber(convertedPhoneNumber(phoneNumber)))
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          resolve({
            exists: true,
            user: querySnapshot.docs[0].data() as User,
          });
        } else {
          resolve({
            exists: false,
            user: null,
          });
        }
      }).catch((err) => {
        reject(err);
      });
  });
};

export default fetchContacts;

