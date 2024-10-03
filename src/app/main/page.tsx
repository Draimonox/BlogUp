"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/header";
import { Center, Loader, Paper, ScrollArea, Text } from "@mantine/core";
import { getCookie } from "cookies-next";

interface User {
  username: string;
  image: string;
  name: string;
}

const MainPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      window.location.href = "/login";
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.details || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
      console.log("Fetched all users successfully!", data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  return (
    <>
      <Header />

      <Center h={100} style={{ paddingTop: "20px" }}></Center>

      <Center style={{ height: "80vh", paddingTop: "20px" }}>
        <ScrollArea
          h={"100%"}
          type="never"
          style={{
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.username}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "1rem",
                  width: "100%",
                }}
                onClick={() => {
                  window.location.href = `/profile/${user.username}`;
                }}
              >
                <Paper
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                  shadow="sm"
                  withBorder
                  p="xl"
                  radius="xl"
                >
                  {user.image && (
                    <Image
                      src={user.image}
                      alt={`${user.username}'s profile`}
                      width={75}
                      height={75}
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <Text fw={700}>@{user.username}</Text>
                </Paper>
              </div>
            ))
          ) : (
            <Center>
              <Loader color="green" />
            </Center>
          )}
        </ScrollArea>
      </Center>
    </>
  );
};

export default MainPage;
