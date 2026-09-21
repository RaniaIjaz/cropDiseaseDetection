import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: "",
    userName: "",
    email: "",
  },
  token: "",
  isLogin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user after login or register
    setUser(state, action) {
      const { id, userName, email, token } = action.payload;
      state.user = { id, userName, email };
      state.token = token || "";
      state.isLogin = true;
    },

    // Logout and clear everything
    logout(state) {
      state.user = { id: "", userName: "", email: "" };
      state.token = "";
      state.isLogin = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
