"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/header";
import { Center, Divider, Loader, Paper, Text } from "@mantine/core";
import { getCookie } from "cookies-next";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    image: string;
  };
}

const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      window.location.href = "/login";
    } else {
      getAllPosts();
    }
  }, []);

  const getAllPosts = async () => {
    try {
      const res = await fetch("/api/findAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(data);
      console.log("Fetched all posts successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div>
        {loading ? (
          <Center h={500}>
            <Loader color="green" />
          </Center>
        ) : posts.length > 0 ? (
          <>
            <Text ta="center" td="underline" size="xl" fw={1000}>
              All Posts
            </Text>
            <ul>
              {posts.map((post) => (
                <Center key={post.id}>
                  <Paper
                    shadow="lg"
                    radius="xl"
                    pb={25}
                    pt={0}
                    withBorder
                    p="xl"
                    style={{
                      marginTop: "15px",
                      width: "50%",
                    }}
                  >
                    <li
                      key={post.id}
                      style={{
                        marginTop: "15px",
                        borderRadius: "5%",
                      }}
                    >
                      <Text ta="center" size="lg" fw={500} td="underline">
                        {post.title}
                      </Text>
                      <Text ta="center">{post.content}</Text>
                      {post.author && post.author.image && (
                        <Center>
                          <Image
                            src={post.author.image}
                            alt={`${post.author.username}'s profile`}
                            width={50}
                            height={50}
                            style={{ borderRadius: "50%", marginTop: "10px" }}
                          />
                        </Center>
                      )}
                      {post.author && post.author.username && (
                        <Text ta="center">
                          <strong>Posted by: </strong>@{post.author.username}
                        </Text>
                      )}
                    </li>
                  </Paper>
                </Center>
              ))}
            </ul>
          </>
        ) : (
          <Center h={500}>
            <Text size="xl">There aren&apos;t any posts available.</Text>
          </Center>
        )}
      </div>
    </>
  );
};

export default MainPage;
