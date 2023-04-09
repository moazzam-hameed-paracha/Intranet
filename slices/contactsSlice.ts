import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";
import { User } from "../modals/fireStoreUserConverter";
import { AppStateType } from "../store";
import { uniq, uniqBy } from "lodash";

export interface ContactInterface {
  name: string;
  phoneNumber: string;
  inSystem: boolean;
  user?: User | null;
}

export const initialState: ContactInterface[] = [];

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setContacts: (state, action: PayloadAction<ContactInterface[]>) => {
      return uniqBy(action.payload,"phoneNumber");
    },
  },
});

export const actions = contactsSlice.actions;

// Action Selector
export const useContactsStateActions = () => useActions({ actions });

const contactsSelector = (state: AppStateType) => state.contacts;
export const useContactsState = () => useSelector(contactsSelector, shallowEqual);

export default contactsSlice.reducer;
