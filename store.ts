import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";

import { combineReducers } from "redux";
import userSlice from "./slices/userSlice";
import groupSlice from "./slices/groupSlice";
import contactsSlice from "./slices/contactsSlice";
import chatUISlice from "./slices/chatUISlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const RootReducer = combineReducers({
  user: userSlice,
  group: groupSlice,
  contacts: contactsSlice,
  chatUI: chatUISlice,
});

const persistedReducer = persistReducer(persistConfig, RootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type AppStateType = ReturnType<typeof RootReducer>;
