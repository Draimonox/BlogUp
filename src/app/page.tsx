//  ██████████                        ███  ███████████ █████               ██████████
// ░░███░░░░███                      ░░░  ░█░░░███░░░█░░███               ░░███░░░░███
//  ░███   ░░███ ████████   ██████   ████ ░   ░███  ░  ░███████    ██████  ░███   ░░███  ██████  █████ █████
//  ░███    ░███░░███░░███ ░░░░░███ ░░███     ░███     ░███░░███  ███░░███ ░███    ░███ ███░░███░░███ ░░███
//  ░███    ░███ ░███ ░░░   ███████  ░███     ░███     ░███ ░███ ░███████  ░███    ░███░███████  ░███  ░███
//  ░███    ███  ░███      ███░░███  ░███     ░███     ░███ ░███ ░███░░░   ░███    ███ ░███░░░   ░░███ ███
//  ██████████   █████    ░░████████ █████    █████    ████ █████░░██████  ██████████  ░░██████   ░░█████
// ░░░░░░░░░░   ░░░░░      ░░░░░░░░ ░░░░░    ░░░░░    ░░░░ ░░░░░  ░░░░░░  ░░░░░░░░░░    ░░░░░░     ░░░░░
"use client";

import Header from "./components/header";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Image from "next/image";

function SearchPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const token = getCookie("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      getAllUsers();
    }
  }, [token, router]);

  async function getAllUsers() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
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
              {user.image ? (
                <Image
                  src={`https://firebasestorage.googleapis.com/v0/b/blogup-ee20a.appspot.com/o/images%2F${user.image}?alt=media`}
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
