// Action Types
const SET_AUTHENTICATED = "SET_AUTHENTICATED";
const SET_USER_ROLE = "SET_USER_ROLE";

// Action Creators
export const setAuthenticated = (authenticated) => ({
  type: SET_AUTHENTICATED,
  payload: authenticated,
});

export const setUserRole = (role) => ({
  type: SET_USER_ROLE,
  payload: role,
});

// Reducer
const initialState = {
  authenticated: false,
  userRole: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, authenticated: action.payload };

    case SET_USER_ROLE:
      return { ...state, userRole: action.payload };

    default:
      return state;
  }
};

export default authReducer;
