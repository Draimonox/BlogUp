"use client";

import React, { useState } from "react";
// import { Image } from "@mantine/core";
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
} from "@mantine/core";
import { useRouter } from "next/navigation";

import { setCookie } from "cookies-next";
import firebaseApp from "@/firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function Register() {
  const [name, setName] = useState("");
  const [username, setUserame] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const router = useRouter();
  //

  const handleUpload = () => {
    if (!image) return;

    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  const handleImageChange = (file: File | null) => {
    if (file) {
      setUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setUrl("");
    setImage(null);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (!username || !email || !password) {
      console.log({ name, username, email, password, bio, url });
      throw new Error("Username, Email, and Password required!");
    }
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
          bio,
          image: url,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setCookie("userId", data.id);
        handleUpload();
        router.push("/");
      } else {
        throw new Error(data.details);
      }
    } catch (err) {
      console.error(err);
    } finally {
      console.log("horrayy");
    }
  }

  return (
    <>
      <Center h={750}>
        <form style={{ width: "20%" }} onSubmit={handleRegister}>
          <FileInput
            variant="unstyled"
            size="md"
            radius="lg"
            label="Profile Picture"
            placeholder="Click Here *"
            style={{}}
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
