import { combineReducers } from "redux";
import auth from "./auth.slice";
import campaigns from "./entities/campaigns.slice";
import categories from "./entities/categories.slice";
import nominations from "./entities/nominations.slice";
import works from "./entities/works.slice";

export default combineReducers({
  auth,
  campaigns,
  categories,
  nominations,
  works,
});
