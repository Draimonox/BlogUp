import React from "react";
import { ref } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import Header from "../components/header";

function Profile() {
  //   const pathReference = ref(storage, "images/stars.jpg");
  //   const gsReference = ref(storage, "gs://bucket/images/stars.jpg");
  //   const httpsReference = ref(
  //     storage,
  //     "https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg"
  //   );
  return (
    <>
      <Header />
      <h1>Hellow world</h1>
    </>
  );
}
export default Profile;
