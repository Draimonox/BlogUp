// firebaseConfig.ts
import { initializeApp } from "firebase/app";
// import { FirebaseOptions } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBbE-sO9YZKwuv4fkJNn4E9Y5ON9-BxENY",
  authDomain: "blogup-ee20a.firebaseapp.com",
  projectId: "blogup-ee20a",
  storageBucket: "blogup-ee20a.appspot.com",
  messagingSenderId: "116595688263",
  appId: "1:116595688263:web:765c495171dd7c66320262",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
