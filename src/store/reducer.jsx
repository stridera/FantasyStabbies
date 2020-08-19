import { combineReducers } from "redux";
import auth from "./auth.slice";
import campaigns from "./entities/campaigns.slice";
import questions from "./entities/questions.slice";

export default combineReducers({
  auth,
  campaigns,
  questions,
});
