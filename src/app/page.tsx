"use client";

import Header from "./components/header";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Center,
  CloseButton,
  Input,
  Loader,
  Paper,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconAt } from "@tabler/icons-react";

function SearchPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  interface User {
    username: string;
    image: string;
    name: string;
  }
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      window.location.href = "/login";
    } else {
      getAllUsers();
    }
  }, [router]);

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
        console.log(data);
        console.log("Fetched all users successfully!");
      } else {
        throw new Error(data.details);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  return (
    <>
      <Header />

      <Center h={100} style={{ paddingTop: "20px" }}>
        <Input
          size="lg"
          radius="xl"
          style={{ width: "25%" }}
          placeholder="Handle"
          rightSectionPointerEvents="all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          leftSection={<IconAt size={20} />}
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setSearchTerm("")}
              style={{ display: searchTerm ? undefined : "none" }}
            />
          }
        />
      </Center>

      <Center style={{ height: "80vh", paddingTop: "20px" }}>
        <ScrollArea
          h={"100%"}
          type="never"
          style={{
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.username}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "1rem",
                  height: "100%",
                  width: "100%",
                  maxWidth: "600px",
                }}
                onClick={() => {
                  router.push(`/profile/${user.username}`);
                }}
              >
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
                  {user.image && (
                    <Image
                      src={user.image}
                      alt=": )"
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
}

export default SearchPage;
