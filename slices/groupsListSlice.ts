import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";
import { GroupInterface} from "../modals";
import { AppStateType } from "../store";

export type GroupListInterface = GroupInterface[];

export const initialState: GroupListInterface = [];

export const groupsListSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    addToGroupsList: (
      state,
      action: PayloadAction<GroupListInterface>
    ) => {
      state = uniqBy([...state, ...action.payload], "uid");
    },
    updateGroupsList: (
      // state,
      // action: PayloadAction<GroupListInterface>
    ) => {
      // TODO: Make this function.
    },
  },
});

export const actions = groupsListSlice.actions;

// Action Selector
export const useGroupsListSliceActions = () => useActions({ actions });

const groupsListSelector = (state: AppStateType) => state.groupsList;
export const useGroupsListSlice = () =>
  useSelector(groupsListSelector, shallowEqual);

export default groupsListSlice.reducer;