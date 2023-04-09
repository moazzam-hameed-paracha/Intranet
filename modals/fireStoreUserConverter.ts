import { DocumentData } from "firebase/firestore";

// eslint-disable-next-line no-unused-vars
// enum UserStatus is used for the status of the user in the app (online, offline, etc) and is used in the user slice and userReducer file in the slices folder of the project
enum UserStatus {
  // eslint-disable-next-line no-unused-vars
  INVITED = "invited",
  // eslint-disable-next-line no-unused-vars
  ACTIVE = "active",
}

class User {
  phoneNumber: string;
  displayName: string;
  photoURL: string;
  designation: string;
  isAdmin: boolean;
  status: UserStatus;
  notificationToken: string;

  constructor(
    phoneNumber: string,
    displayName: string,
    photoURL: string,
    designation: string,
    isAdmin: boolean,
    status: UserStatus,
    notificationToken: string,
  ) {
    this.phoneNumber = phoneNumber;
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.designation = designation;
    this.isAdmin = isAdmin;
    this.status = status;
    this.notificationToken = notificationToken;
  }
}

const fireStoreUserConverter = {
  toFirestore(user: User): DocumentData {
    return user;
  },
  fromFirestore(snapshot, options): User {
    const data = snapshot.data(options)! as User;
    return new User(
      data.phoneNumber,
      data.displayName,
      data.photoURL,
      data.designation,
      data.isAdmin,
      data.status,
      data.notificationToken,
    );
  },
};

export { User, fireStoreUserConverter, UserStatus };
