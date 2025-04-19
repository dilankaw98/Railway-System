import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCStSUzhdVB4dXwYFQx_qpVbZO9ODrNv8k",
  authDomain: "supply-chain-project-b6ff5.firebaseapp.com",
  projectId: "supply-chain-project-b6ff5",
  storageBucket: "supply-chain-project-b6ff5.firebasestorage.app",
  messagingSenderId: "407754470776",
  appId: "1:407754470776:web:25fa521b2f74deda06048d",
  measurementId: "G-TWQNLJZ0RD",
  databaseURL: "https://supply-chain-project-b6ff5-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };
