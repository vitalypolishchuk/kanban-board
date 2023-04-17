import { LOAD_ISSUES, UPDATE_ISSUES, CLEAR_ISSUES } from "./types";
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
    case CLEAR_ISSUES:
      console.log(initialState);
      return initialState;
    default:
      return state;
  }
};

export default issuesReducer;
