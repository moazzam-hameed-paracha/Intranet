import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";
import { AppStateType } from "../store";

type ChatUIStateInterface = {
  groupId: string;
  scrollToTop: boolean;
  displaySnackbarDate: Date;
};

export const initialState: ChatUIStateInterface = {
  groupId: "",
  scrollToTop: true,
  displaySnackbarDate: null,
};

export const chatUISlice = createSlice({
  name: "chatUI",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setGroupId: (state, action: PayloadAction<string>) => {
      state.groupId = action.payload;
    },
    setScrollToTop: (state, action: PayloadAction<boolean>) => {
      state.scrollToTop = action.payload;
    },
    setDisplaySnackbarDate: (state, action: PayloadAction<Date>) => {
      state.displaySnackbarDate = action.payload;
    },
  },
});

export const actions = chatUISlice.actions;

// Action Selector
export const useChatUIStateActions = () => useActions({ actions });

const chatUIStateSelector = (state: AppStateType) => state.chatUI;
export const useChatUIState = () =>
  useSelector(chatUIStateSelector, shallowEqual);

export default chatUISlice.reducer;
