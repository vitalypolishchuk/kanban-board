import { SET_ERROR } from "./types";

interface ActionType {
  type: string;
  payload: string;
}

const initialState: string = "";

const errReducer = (state: string = initialState, action: ActionType) => {
  switch (action.type) {
    case SET_ERROR:
      return action.payload;
    default:
      return state;
  }
};

export default errReducer;
