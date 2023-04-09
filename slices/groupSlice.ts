import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";
import { GroupInterface, GroupLevel } from "../modals";
import { AppStateType } from "../store";

export const initialState: GroupInterface = {
  uid: "",
  name: "",
  level: GroupLevel.TEMPORARY,
  members: [],
  photo: "",
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setGroup: (state, action: PayloadAction<GroupInterface>) => {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.level = action.payload.level;
      state.members = action.payload.members;
      state.photo = action.payload.photo;
    },
    setUid: (state, action) => {
      state.uid = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setLevel: (state, action: PayloadAction<GroupLevel>) => {
      state.level = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export const actions = groupSlice.actions;

// Action Selector
export const useGroupStateActions = () => useActions({ actions });

const groupSelector = (state: AppStateType) => state.group;
export const useGroupState = () => useSelector(groupSelector, shallowEqual);

export default groupSlice.reducer;
