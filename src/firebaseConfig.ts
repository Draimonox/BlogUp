// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
