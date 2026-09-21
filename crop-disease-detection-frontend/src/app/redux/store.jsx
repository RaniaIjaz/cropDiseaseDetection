

// import userSlice from "./Slices/userSlice";
// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers, createStore } from "redux";
// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
//   persistStore,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["user"],
// };

// const reducer = combineReducers({
//   user: userSlice,
// });

// const persistedReducer = persistReducer(persistConfig, reducer);

// let store = createStore(persistedReducer);
// let persistor = persistStore(store);

// const reduxStore = { store, persistor };

// export default reduxStore; 



"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// combine reducers
const rootReducer = combineReducers({
  user: userSlice,
});

// persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// create persistor
export const persistor = persistStore(store);
