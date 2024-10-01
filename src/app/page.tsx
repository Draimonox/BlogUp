"use client";

import Header from "./components/header";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Center, Paper, ScrollArea, Text } from "@mantine/core";

function SearchPage() {
  interface User {
    username: string;
    image?: string;
    name: string;
  }

  const [users, setUsers] = useState<User[]>([]);
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
      <Center style={{ height: "85vh", paddingTop: "60px" }}>
        <ScrollArea
          h={"100%"}
          type="never"
          style={{
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              height: "100%",
              width: "100%",
              maxWidth: "600px",
            }}
            onClick={() => {
              router.push("/blogUp");
            }}
          >
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <Paper
                  key={user.username}
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
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={`${user.name}'s profile`}
                      width={75}
                      height={75}
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <p>: )</p>
                  )}
                  <Text fw={700}>{user.username}</Text>
                </Paper>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </ScrollArea>
      </Center>
    </>
  );
}

export default SearchPage;
