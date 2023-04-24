import { LOAD_REPO, CLEAR_REPO, UPDATE_REPO } from "./types";
import { RepoType } from "./StateTypes.types";

interface ActionType {
  type: string;
  payload?: RepoType;
}

const initialState: RepoType = {
  profileName: "",
  repoName: "",
  stars: 0,
  profileUrl: "",
  repoUrl: "",
};

const repoReducer = (state: RepoType = initialState, action: ActionType) => {
  switch (action.type) {
    case LOAD_REPO:
      return action.payload;
    case UPDATE_REPO:
      return action.payload;
    case CLEAR_REPO:
      return initialState;
    default:
      return state;
  }
};

export default repoReducer;
