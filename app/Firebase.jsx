import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-1",
  authDomain: "chat.firebaseapp.com",
  databaseURL: "url",
  projectId: "chatId",
  storageBucket: "chat.appspot.com",
  messagingSenderId: "0330654750868",
  appId: "1:0330654750868:web:",
  measurementId: "G-0G",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
const storage = getStorage();

const db = getFirestore(app);

export { app, auth, db, storage };
