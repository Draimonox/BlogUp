"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Anchor,
  Button,
  Center,
  Divider,
  FileInput,
  Input,
  PasswordInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { storage } from "@/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import dotenv from "dotenv";
dotenv.config();

function Register() {
  const [name, setName] = useState("");
  const [username, setUserame] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState<string>("");
  const router = useRouter();

  //
  const handleUpload = async () => {
    try {
      const imgRef = ref(storage, `images/${url.split("/").pop()}`);
      const response = await fetch(url);
      const blob = await response.blob();
      await uploadBytes(imgRef, blob);
      console.log("Uploaded a blob or file!");
      const downloadURL = await getDownloadURL(imgRef);
      setUrl(downloadURL);
      console.log("File available at", downloadURL);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  const handleImageChange = (file: File | null) => {
    if (file) {
      setUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setUrl("");
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      return;
    }
    if (!username || !email || !password) {
      console.log({ name, username, email, password, bio, url });
      throw new Error("Username, Email, and Password required!");
    }
    const normalizedEmail = email.toLowerCase();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email: normalizedEmail,
          password,
          bio,
          image: url,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setCookie("token", data.token);
        console.log(data.token);
        handleUpload();
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
        <form style={{ width: "20%" }} onSubmit={handleRegister}>
          <div>
            <Title order={1}>Register</Title>
            <Divider my="md" />
          </div>

          <FileInput
            variant="unstyled"
            size="md"
            radius="lg"
            label="Profile Picture"
            placeholder="Click Here *"
            style={{ marginTop: "10px" }}
            onChange={handleImageChange}
          />
          <Center>
            {url && (
              <>
                <Image
                  src={url}
                  alt="Profile Preview"
                  width={100}
                  height={100}
                  style={{ marginBottom: "15px" }}
                />
                <Button
                  variant="transparent"
                  color="red"
                  radius="xl"
                  onClick={handleRemoveImage}
                >
                  x
                </Button>
              </>
            )}
          </Center>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Input
              variant="filled"
              size="lg"
              radius="xl"
              placeholder="Name"
              style={{ width: "100%", marginBottom: "10px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <Input
                variant="filled"
                size="lg"
                radius="xl"
                placeholder="Username"
                style={{ width: "100%" }}
                value={username}
                onChange={(e) => setUserame(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
            <PasswordInput
              variant="filled"
              size="lg"
              radius="xl"
              placeholder="Password"
              style={{ width: "100%" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            radius="xl"
            variant="filled"
            autosize
            maxLength={125}
            minRows={1}
            size="md"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ marginTop: "15px" }}
          />
          <Button
            variant="filled"
            size="lg"
            color="green"
            radius="xl"
            style={{ marginTop: "15px" }}
            type="submit"
          >
            Register
          </Button>
          <Divider
            my="xl"
            label={
              <Anchor href="/login" target="_self" inherit>
                Login
              </Anchor>
            }
          />
        </form>
      </Center>
    </>
  );
}

export default Register;
