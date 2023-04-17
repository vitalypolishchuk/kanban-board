import { LOAD_ISSUES, UPDATE_ISSUES } from "./types";
import { IssueType } from "./StateTypes.types";

interface ActionType {
  type: string;
  payload: IssueType[];
}

const initialState: IssueType[] = [];

const issuesReducer = (state: IssueType[] = initialState, action: ActionType) => {
  switch (action.type) {
    case LOAD_ISSUES:
      return action.payload;
    case UPDATE_ISSUES:
      return action.payload;
    default:
      return state;
  }
};

export default issuesReducer;
