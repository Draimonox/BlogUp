///
"use client";
import { Button, Center, Divider, Textarea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import Header from "../components/header";
function PostBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();
  const token = getCookie("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUsername() {
      if (token) {
        try {
          const decodedToken = jwt.decode(token as string);
          const authorId = (decodedToken as jwt.JwtPayload)?.id;

          if (authorId) {
            const res = await fetch(`/api/blogUp?authorId=${authorId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await res.json();

            if (res.ok) {
              setUsername(data.username);
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
  }, [token, router]);

  async function postBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      throw new Error("Please dont leave the title empty!");
    }
    console.log("Token:", token);

    let decodedToken = null;
    if (token) {
      try {
        decodedToken = jwt.decode(token as string);
        console.log("Decoded Token:", decodedToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
        return;
      }
    }

    const authorId = (decodedToken as jwt.JwtPayload)?.id;
    console.log("Author ID:", authorId);
    try {
      const res = await fetch("/api/blogUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          authorId,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        router.push(`/profile/${username}`);
        console.log("You Just BloggedUp!");
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
      <Center h={500}>
        <form style={{ width: "20%" }} onSubmit={postBlog}>
          <div>
            <Title order={1}>BlogUp!</Title>
            <Divider my="md" />
          </div>

          <Textarea
            label="Title"
            autosize
            withAsterisk
            size="lg"
            radius="xl"
            minRows={1}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Content"
            autosize
            size="lg"
            radius="xl"
            minRows={1}
            style={{ marginTop: "15px" }}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variant="filled"
            color="green"
            size="md"
            radius="xl"
            style={{ marginTop: "15px" }}
            type="submit"
          >
            Post
          </Button>
        </form>
      </Center>
    </>
  );
}

export default PostBlog;
