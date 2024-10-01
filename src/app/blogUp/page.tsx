///
"use client";
import { Button, Center, Divider, Textarea, Title } from "@mantine/core";
import { useState } from "react";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
function PostBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  async function postBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      throw new Error("Please dont leave the title empty!");
    }
    const token = getCookie("token");
    console.log("Token:", token); // Debugging: Log the token

    let decodedToken = null;
    if (token) {
      try {
        decodedToken = jwt.decode(token as string);
        console.log("Decoded Token:", decodedToken); // Debugging: Log the decoded token
      } catch (err) {
        console.error("Failed to decode token:", err);
        router.push("/");
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
          authorId: authorId,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
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
            label="Blog Body"
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
            Button
          </Button>
        </form>
      </Center>
    </>
  );
}

export default PostBlog;
