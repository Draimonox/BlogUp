"use client";
import { Button, Text } from "@mantine/core";

import { deleteCookie, getCookie } from "cookies-next";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

function Header() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function logOut() {
    console.log("Logging out...");
    deleteCookie("token");
    router.push("/login");
  }
  const token = getCookie("token");
  if (!token) {
    router.push("/");
  }

  useEffect(() => {
    async function fetchUsername() {
      if (token) {
        try {
          const decodedToken = jwt.decode(token as string);
          const authorId = (decodedToken as jwt.JwtPayload)?.id;

          if (authorId) {
            // Fetch the username using the authorId
            const res = await fetch(`/api/blogUp?authorId=${authorId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await res.json();

            if (res.ok) {
              await setUsername(data.username);
            } else {
              console.error("Failed to fetch username:", data.error);
            }
          }
        } catch (err) {
          console.error("Failed to decode token or fetch username:", err);
        }
      }
    }

    fetchUsername();
  }, [token]);

  return (
    <>
      <header
        style={{
          paddingRight: "50px",
          paddingTop: "15px",
          paddingBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          size="xl"
          fw={700}
          c="teal.4"
          style={{ marginLeft: "50px", cursor: "pointer" }}
          onClick={() => {
            router.push("/main");
          }}
        >
          BlogUp!
        </Text>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="light"
            color="blue"
            size="lg"
            radius="xl"
            onClick={() => {
              router.push("/");
            }}
          >
            Search
          </Button>
          <Button
            variant="light"
            color="green"
            size="lg"
            radius="xl"
            onClick={() => {
              router.push("/blogUp");
            }}
          >
            BlogUp!
          </Button>
          <Button
            variant="light"
            color="gray"
            size="lg"
            radius="xl"
            disabled={!username}
            onClick={() => {
              console.log("Navigating to profile:", username);
              router.push(`/profile/${username}`);
            }}
          >
            Profile
          </Button>
          <Button
            variant="light"
            color="red"
            size="lg"
            radius="xl"
            onClick={logOut}
          >
            Log out
          </Button>
        </div>
      </header>
    </>
  );
}

export default Header;
