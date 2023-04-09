/* eslint-disable semi */
// Commonly used React hooks
import React, { useEffect } from "react";
import { Text, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import ModalPage from "./screens/GroupChatContacts/ModalPage";
// stack navigator for react native navigation
// createStackNavigator is a function that creates a stack navigator. It takes an object as an argument. The object has a key called screens and it's value is an object. The object has a key called Home and it's value is a function that returns a component.
import { createStackNavigator } from "@react-navigation/stack";

// React native paper provider is a component that provides the theme to the entire app.
import { Provider as PaperProvider } from "react-native-paper";

// library to enable functionality to use assets
// useAssets is a hook that lets you use assets. It is similar to the require function. It is called after the render function is called, but before the DOM is updated. It is called only once during the life cycle of a component. It is used to load assets. It takes an array of strings as an argument. The strings are the names of the assets to load. It returns an array of promises. The promises are the promises that are returned by the assets that are loaded. The promises are resolved when the assets are loaded. The promises are rejected when the assets are not loaded.
import { useAssets } from "expo-asset";

// fonts
// useFonts is a hook that lets you use fonts. It is similar to the require function. It is called after the render function is called, but before the DOM is updated. It is called only once during the life cycle of a component. It returns an array of fonts. The fonts are loaded asynchronously.
import {
  useFonts,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

// everything to do with redux
// react-redux is a library that provides a way to manage state in a React application. It is used to manage the state of the app.
// react-redux Provider is a component that provides the store to the entire app.
import { Provider as ReduxProvider } from "react-redux";
// redux-persist is a library that provides a way to persist the state of the app. Persistance is the process of saving the state of the app to a file. It is used to save the state of the app when the app is closed. PersistGate is a component that provides a way to persist the state of the app.
import { PersistGate } from "redux-persist/lib/integration/react";
// persistStore is a function that takes a store and a configuration object as an argument. It returns a persistor. The persistor is used to persist the state of the app.
import persistStore from "redux-persist/es/persistStore";
// store is a function that takes a reducer and a configuration object as an argument. It returns a store. The store is used to manage the state of the app.
import { store } from "./store";

// custom made theme that contains palettes and colors
// theme is a function that takes a configuration object as an argument. It returns a theme. The theme is used to customize the look of the app.
import { theme } from "./theme";

// isEqual function for comparing objects
// isEqual is a function that takes two objects as arguments and returns a boolean. It is used to compare two objects.
import { isEqual } from "lodash";

// all screens
import SignIn from "./screens/SignIn";
import CompleteProfile from "./screens/CompleteProfile";

import Home from "./screens/Home";
import CreateGroup from "./screens/CreateGroup";
import PeopleSelector from "./screens/PeopleSelector";
import PrivacySettings from "./screens/PrivacySettings";
import ProfileSettings from "./screens/ProfileSettings";
import SelectUser from "./screens/SelectUser";
import FullImage from "./screens/Chat/Components/FullscreenImageView/FullImage";
import GroupSettings from "./screens/GroupSettings";
import DirectChat from "./screens/DirectChatContacts/DirectChat";
import ChatPage from "./screens/Chat";
import Camera from "./screens/Camera";

// hooks that contain functions to CURD group and user data
// useGroupFirebaseActions is a hook that contains functions to CURD group data in Firebase.
// useUserFirebaseActions is a hook that contains functions to CURD user data in Firebase.
import useGroupFirebaseActions from "./hooks/useGroupFirebaseActions";
import useUserFirebaseActions from "./hooks/useUserFirebaseActions";

// useFirebaseSyncWrapper is a hook that contains functions to sync data in Firebase. It is used to sync data when the app is opened.
// import { useFirebaseSyncWrapper } from "./hooks/useFirebaseSyncWrapper";

// firebase object that contains the firebase functions
// import { db } from "./firebase";

// ? What are these?
// import { GroupLevel, GroupMemberPrivilege, UserStatus } from "./modals";

// ? What are these slices used for? What's a slice?
// userSlice is a slice that contains the user data. It is used to manage the state of the user data.
// initialState is the initial state of the user data.
// useUserStateActions is a hook that contains functions to CURD user data in the redux store.
import {
  useUserState,
  initialState as initialUserState,
  useUserStateActions,
} from "./slices/userSlice";

// Custom status bar component - used to change status bar color and other visual elements
import CustomStatusBar from "./components/CustomStatusBar";

// groupSlice is a slice that contains the group data. It is used to manage the state of the group data.
// useGroupState is a hook that contains the group data.
// useGroupStateActions is a hook that contains functions to CURD group data in the redux store.
import { useGroupState, useGroupStateActions } from "./slices/groupSlice";
import AddParticipants from "./screens/AddParticipants";
import CommunicationLogs from "./screens/CommunicationLogs";
import NotificationsPage from "./screens/NotificationsPage";
import DummyNotificationsPage from "./screens/DummyNotificationsPage";
import UsersProfile from "./screens/UsersProfile";
import ForwardMessage from "./screens/ForwardMessage";
import SignInNature from "./screens/SignInNature";
import ContactList from "./screens/contactList";
import ChatDelete from "./screens/ChatDelete";
import GroupSettingsTest from "./screens/GroupSettingsTest";
import ChatPageAdmin from "./screens/ChatAdmin";
import ChatPageNajeeb from "./screens/ChatNajeeb";
import GroupChat from "./screens/GroupChatContacts/GroupChat";
import Support from "./screens/Support";
import PendingInvites from "./screens/PendingInvites";
// LogBox, used to ignore warnings in console
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  "Clipboard has been extracted from react-native core and will be removed in a future release.",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.",
  'Each child in a list should have a unique "key" prop.',
  "source.uri should not be an empty string",
  "Non-serializable values were found in the navigation state. Check:",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  "VirtualizedList: missing keys for items, make sure to specify a key or id property on each item or provide a custom keyExtractor.",
  "Function DocumentReference.update() called with invalid data. Unsupported field value: undefined",
]);

// created a stack navigator object to handle all screens
const Stack = createStackNavigator();

// persistorStore is a function that takes a store and a configuration object as an argument. It returns a persistor. The persistor is used to persist the state of the app.
let persistor = persistStore(store);

function App() {
  // Calling ExpoNotifications function to initialize notifications - need to make sure that this is the right place to initialize notifications - need to convert function to hooks

  // ? What is this? Seems like all states are being initialized here - Looks like a redux thing
  // useUserState is a hook that contains the user data.
  // useUserStateActions is a hook that contains functions to CURD user data in the redux store.
  // useGroupState is a hook that contains the group data.
  // useGroupStateActions is a hook that contains functions to CURD group data in the redux store.
  const UserState = useUserState();
  const GroupState = useGroupState();
  const GroupStateActions = useGroupStateActions();
  const UserStateActions = useUserStateActions();

  // useGroupFirebaseActions is a hook that contains functions to CURD group data in Firebase.
  // useUserFirebaseActions is a hook that contains functions to CURD user data in Firebase.
  // const GroupFirebaseActions = useGroupFirebaseActions();
  // const UserFirebaseActions = useUserFirebaseActions();

  // ? What is this and wht is it commented out? Seems like it is used to reset states, for example if a user's state is set as logged in and all user data is available, this will be used to reset the user's state to logged out and clear all user data

  // UserStateActions.resetState() is a function that resets the user state to the initial state. It is used to reset the user state when the app is opened.
  // UserStateActions.resetState();

  // GroupStateActions.resetState() is a function that resets the group state to the initial state. It is used to reset the group state when the app is opened.
  // GroupStateActions.resetState();

  // useEffect hook to check if user is logged in and if user data is available - if user is logged in and user data is available, set user state to logged in and set user data to user data from firebase - if user is not logged in, set user state to logged out and clear all user data - if user is logged in and user data is not available, set user state to logged out and clear all user data
  useEffect(() => {
    console.log({
      UserState,
      GroupState,
    });
  }, [GroupState, UserState]);

  // ? What is all of this and why is it commented out?
  // const {
  //   data,
  //   error: syncError,
  //   success,
  //   loading: syncLoading,
  // } = useFirebaseSyncWrapper(UserFirebaseActions.getUser("+923055180022"));

  // React.useEffect(() => {
  //   if (success === true) {
  //     UserStateActions.setUser(data.user.data());
  //   }
  // const promise = async () => {
  // const res = await GroupFirebaseActions.createGroup({
  //   name: "Test Group",
  //   photo:
  //     "https://media.istockphoto.com/photos/hot-air-balloons-flying-over-the-botan-canyon-in-turkey-picture-id1297349747?b=1&k=20&m=1297349747&s=170667a&w=0&h=oH31fJty_4xWl_JQ4OIQWZKP8C6ji9Mz7L4XmEnbqRU=",
  //   level: GroupLevel.DEPARTMENTAL,
  // });
  // console.log("res", res);
  // const user = await UserFirebaseActions.getUser("+923055180022");
  // const resp = await GroupFirebaseActions.addMemberToGroup({
  //   userId: user.data.user.id,
  //   groupId: "Yw2RhOxV8a4GX0w9njXS",
  //   privilege: GroupMemberPrivilege.CEO,
  // });
  // console.log("res", resp);
  // const res = await UserFirebaseActions.addUser({
  //   phoneNumber: "+923340512689",
  //   designation: "danda",
  //   displayName: "tayyab",
  //   isAdmin: true,
  //   photoURL: null,
  //   status: UserStatus.INVITED,
  // });
  // console.log("res", res);
  // };

  //   if (syncError !== null && syncLoading === false) {
  //     console.log("syncError", syncError);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [syncLoading]);

  // initialRouteName is the initial route or screen name - if user is logged in, it will be home, otherwise it will be sign in
  const initialRouteName = isEqual(initialUserState, UserState)
    ? "SignInNature"
    : "Home";

  // return function is which is used to render the app, and here it is being returned as a stack navigator object with the initial route being the sign in screen or home screen depending on the user state - if user was logged in, it would be home screen, otherwise it would be sign in screen - this is technically the root of the app - stack navigator is used to handle all screens and navigation is used to handle the navigation between screens - copilot
  return (
    <NavigationContainer>
      <Stack.Navigator
        // stack navigator has a header property that is used to specify the header of the screen - here it is being set to false, meaning there is no header
        screenOptions={{ headerShown: false }}
        // stack navigator has a initialRouteName property that is used to specify the initial route of the stack navigator - here it is being set to sign in screen or home screen depending on the user state - if user was logged in, it would be home screen, otherwise it would be sign in screen
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="SignInNature" component={SignInNature} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="Chat" component={ChatPage} />
        <Stack.Screen name="ChatDelete" component={ChatDelete} />
        <Stack.Screen name="GroupSettingsTest" component={GroupSettingsTest} />
        <Stack.Screen name="ChatAdmin" component={ChatPageAdmin} />
        <Stack.Screen name="ChatPageNajeeb" component={ChatPageNajeeb} />
        <Stack.Screen name="GroupSettings" component={GroupSettings} />
        <Stack.Screen name="PendingInvites" component={PendingInvites} />
        <Stack.Screen name="UsersProfile" component={UsersProfile} />
        <Stack.Screen name="ForwardMessage" component={ForwardMessage} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
        <Stack.Screen name="SelectUser" component={SelectUser} />
        <Stack.Screen name="AddParticipants" component={AddParticipants} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="CommunicationLogs" component={CommunicationLogs} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="NotificationsPage" component={NotificationsPage} />
        <Stack.Screen name="PeopleSelector" component={PeopleSelector} />
        <Stack.Screen
          name="DummyNotificationsPage"
          component={DummyNotificationsPage}
        />
        <Stack.Screen name="DirectContacts" component={DirectChat} />
        <Stack.Screen name="GroupContacts" component={GroupChat} />
        <Stack.Screen name="FullImage" component={FullImage} />
        <Stack.Screen name="ModalPage" component={ModalPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App is being exported here - this is the root of the app
function Main() {
  // useAssets hook is used to load assets - here it is being used to load the assets for the app
  const [assets] = useAssets([
    require("./assets/icon-square.png"),
    require("./assets/chatbg.png"),
    require("./assets/user-icon.png"),
    require("./assets/logo.png"),
  ]);

  // useFonts hook is used to load fonts - here it is being used to load the fonts for the app
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // this if statement is used to check if the fonts have been loaded - if they have been loaded, then the app is being rendered, otherwise it is being rendered as a loading screen
  if (!assets || !fontsLoaded) {
    return <Text>Loading</Text>;
  }

  // this return statement is used to render the app - the app is being rendered here using the App component define above - this is the root of the app
  return (
    // ReduxProvider is used to provide the redux store to the app - this is used to pass the store to the app
    // PersistGate is used to persist the store to the device - this is used to persist the store to the device so that the app can be opened again and it will still have the state
    // PaperProvider is used to provide the theme to the app - this is used to provide the theme to the app
    // CustomStatusBar is used to provide the status bar to the app - this is used to provide the status bar to the app
    // App component define above is being rendered here - this is the root of the app
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <CustomStatusBar />
          <App />
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

// export statement is used to export the Main component - this is the root of the app
export default Main;
