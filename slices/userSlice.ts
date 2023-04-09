import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";
import { UserInterface, UserStatus } from "../modals";
import { AppStateType } from "../store";

export const initialState: UserInterface = {
  displayName: null,
  phoneNumber: null,
  photoURL: null,
  isAdmin: false,
  designation: null,
  status: null,
  notificationToken: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setUser: (state, action: PayloadAction<UserInterface>) => {
      state.displayName = action.payload.displayName;
      state.phoneNumber = action.payload.phoneNumber;
      state.photoURL = action.payload.photoURL;
      state.designation = action.payload.designation;
      // state.isAdmin = action.payload.isAdmin;
      // state.status = action.payload.status;
      state.notificationToken = action.payload.notificationToken;
    },
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setPhotoURL: (state, action) => {
      state.photoURL = action.payload;
    },
    setDesignation: (state, action) => {
      state.designation = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setStatus: (state, action: PayloadAction<UserStatus>) => {
      state.status = action.payload;
    },
    setNotificationToken: (state, action) => {
      state.notificationToken = action.payload;
    },
  },
});

export const actions = userSlice.actions;

// Action Selector
export const useUserStateActions = () => useActions({ actions });

/**
 * Usage:
 * import { useUserStateActions } from "./slices/userSlice";
 *
 * --- 1st way to use
 *
 * const { setUser } = useUserStateActions();
 * setUser({
 *  uid: "123",
 * displayName: "moazzam",
 * phoneNumber: null,
 * photoURL: null,
 * })
 *
 * --- 2nd way to use
 *
 * const UserActions = useUserStateActions();
 * UserActions.setUser({
 * uid: "123",
 * displayName: "moazzam",
 * phoneNumber: null,
 * photoURL: null,
 * })
 *
 **/

// Slice Selector
const userSelector = (state: AppStateType) => state.user;
export const useUserState = () => useSelector(userSelector, shallowEqual);

/**
 * Usage:
 * import { useUserState } from "./slices/userSlice";
 *
 * --- 1nd way to use
 *
 * const userState = useUserState();
 * console.log(userState.uid)
 *
 * --- 2nd way to use
 *
 * const {uid} = useUserState();
 * console.log(uid)
 *
 **/

export default userSlice.reducer;
