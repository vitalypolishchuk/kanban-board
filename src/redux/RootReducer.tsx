import { combineReducers } from "redux";
import repoReducer from "./RepoReducer";
import issuesReducer from "./issuesReducer";
import errReducer from "./ErrorReducer";

export const rootReducer = combineReducers({
  repo: repoReducer,
  issues: issuesReducer,
  err: errReducer,
});
