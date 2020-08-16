import { combineReducers } from "redux";
import auth from "./auth.slice";
import campaigns from "./campaigns.slice";

export default combineReducers({
  auth,
  campaigns,
});
