"use client";

import React, { useState } from "react";
import {
  Anchor,
  Button,
  Center,
  Divider,
  FileInput,
  Input,
  Textarea,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

function Register() {
  const [name, setName] = useState("");
  const [username, setUserame] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  //

  async function handleRegister() {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setCookie("userId", data.id);
        router.push("/");
      } else {
        throw new Error(data.details);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target?.value);
    console.log(name);
  };
  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserame(e.target?.value);
    console.log(password);
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target?.value);
    console.log(email);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target?.value);
    console.log(password);
  };
  return (
    <>
      <Center h={600}>
        <form style={{ width: "20%" }}>
          <Divider
            my="xl"
            label={
              <Anchor href="/login" target="_self" inherit>
                Login
              </Anchor>
            }
          />
          <FileInput
            variant="unstyled"
            size="md"
            radius="lg"
            label="Profile Picture"
            placeholder="Click Here *"
            style={{ marginBottom: "25px" }}
          />
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Input
              variant="filled"
              size="lg"
              radius="xl"
              placeholder="Name"
              style={{ width: "100%", marginBottom: "10px" }}
              value={name}
              onChange={handleName}
            />
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <Input
                variant="filled"
                size="lg"
                radius="xl"
                placeholder="Username"
                style={{ width: "100%" }}
                value={username}
                onChange={handleUsername}
              />
              <span
                style={{
                  color: "red",
                  position: "absolute",
                  top: "50%",
                  right: "-20px",
                  transform: "translateY(-50%)",
                }}
              >
                *
              </span>
            </div>
          </div>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Input
              variant="filled"
              size="lg"
              radius="xl"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
              style={{ width: "100%" }}
            />
            <span
              style={{
                color: "red",
                position: "absolute",
                top: "50%",
                right: "-20px",
                transform: "translateY(-50%)",
              }}
            >
              *
            </span>
          </div>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Input
              variant="filled"
              size="lg"
              radius="xl"
              placeholder="Password"
              style={{ width: "100%" }}
              value={password}
              onChange={handlePassword}
            />
            <span
              style={{
                color: "red",
                position: "absolute",
                top: "50%",
                right: "-20px",
                transform: "translateY(-50%)",
              }}
            >
              *
            </span>
          </div>
          <Textarea
            placeholder="Bio"
            label="Write something about yourself for others to see!"
            radius="lg"
            variant="filled"
            autosize
            minRows={1}
            size="md"
            style={{ marginTop: "15px" }}
          />
          <Button
            variant="filled"
            size="lg"
            color="green"
            radius="xl"
            style={{ marginTop: "15px" }}
            onSubmit={handleRegister}
          >
            Register
          </Button>
        </form>
      </Center>
    </>
  );
}

export default Register;
