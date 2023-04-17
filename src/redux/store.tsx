import { createStore, compose, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { rootReducer } from "./RootReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(applyMiddleware(reduxThunk)));
