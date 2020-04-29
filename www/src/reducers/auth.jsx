import { USER_LOADED, AUTH_ERROR, LOGOUT } from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isModerator: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isModerator: data.moderator || false,
        loading: false,
        user: data,
      };
    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isModerator: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}
