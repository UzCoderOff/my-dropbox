import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDX771QoIlzqL1_sXAV2NOXmqiM1qMMZfQ",
  authDomain: "basecamp-76103.firebaseapp.com",
  projectId: "basecamp-76103",
  storageBucket: "basecamp-76103.appspot.com",
  messagingSenderId: "664479728688",
  appId: "1:664479728688:web:f51547744af04fccbb19f5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export {auth, storage}