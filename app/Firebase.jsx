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
  apiKey: "AIzaSyDUW4bCiEZzx23Tgy-DMQ54CSY4RdNDki4",
  authDomain: "chat-vat-576e4.firebaseapp.com",
  databaseURL:
    "https://chat-vat-576e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-vat-576e4",
  storageBucket: "chat-vat-576e4.appspot.com",
  messagingSenderId: "595520556908",
  appId: "1:595520556908:web:08aaaa6fee3cc1e1dfed49",
  measurementId: "G-99T4WJ1K42",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
const storage = getStorage();

const db = getFirestore(app);

export { app, auth, db, storage };
