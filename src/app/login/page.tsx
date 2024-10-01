"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Center,
  PasswordInput,
  Divider,
  Anchor,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { deleteCookie, setCookie } from "cookies-next";
import { Title } from "@mantine/core";

deleteCookie("token");
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      console.log({ email, password });
      throw new Error("Email and Password required!");
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setCookie("token", data.token);
        console.log(data.token);
        router.push("/");
      } else {
        throw new Error(data.details);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Center h={800}>
        <form style={{ width: "20%" }} onSubmit={handleLogin}>
          <div>
            <Title order={1}>Login</Title>
            <Divider my="md" />
          </div>
          <Input
            variant="filled"
            size="lg"
            radius="xl"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", marginTop: "10px" }}
          />
          <PasswordInput
            variant="filled"
            size="lg"
            radius="xl"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <Button
            variant="filled"
            size="lg"
            color="green"
            radius="xl"
            style={{ marginTop: "15px" }}
            type="submit"
          >
            Login
          </Button>
          <Divider
            my="xl"
            label={
              <Anchor href="/register" target="_self" inherit>
                Register
              </Anchor>
            }
          />
        </form>
      </Center>
    </>
  );
}

export default Login;
