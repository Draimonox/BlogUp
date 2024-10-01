"use client";

import Header from "./components/header";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Image from "next/image";

function SearchPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    console.log(token);
    if (!token) {
      router.push("/login");
    } else {
      getAllUsers();
    }
  }, []);

  async function getAllUsers() {
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setUsers(data);
        console.log("Fetched all users successfully!");
      } else {
        throw new Error(data.details);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Header />
      <div>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div key={user.username}>
              {console.log(user.image)}
              {user.image ? (
                <Image
                  src={user.image} // Assuming user.image already includes the token
                  alt={`${user.name}'s profile`}
                  width={100}
                  height={100}
                />
              ) : (
                <p>No image available</p>
              )}
              <p>{user.username}</p>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </>
  );
}

export default SearchPage;
