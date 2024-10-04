"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/header";
import { Button, Center, Divider, Loader, Paper, Text } from "@mantine/core";
import { getCookie } from "cookies-next";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    image: string;
  };
  likes: number;
}

const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

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
      // setPosts(data);
      const postsWithLikes = data.map((post: Post) => ({
        ...post,
        likes: post.likes || 0,
      }));

      setPosts(postsWithLikes);
      console.log("Fetched all posts successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleLikes(postId: string) {
    const isLiked = likedPosts.includes(postId);

    try {
      await fetch(`/api/likePost/${postId}`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const newLikes = isLiked ? post.likes - 1 : post.likes + 1;
            return { ...post, likes: newLikes };
          }
          return post;
        })
      );

      setLikedPosts((prevLiked) =>
        isLiked
          ? prevLiked.filter((id) => id !== postId)
          : [...prevLiked, postId]
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  }
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
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      window.location.href = `/profile/${post.author.username}`;
                    }}
                  >
                    <li
                      key={post.id}
                      style={{
                        marginTop: "15px",
                        borderRadius: "5%",
                      }}
                    >
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
                      <Divider size="sm" />
                      <Text
                        ta="center"
                        size="lg"
                        fw={500}
                        style={{ marginTop: "15px" }}
                        td="underline"
                      >
                        {post.title}
                      </Text>
                      <Text ta="center">{post.content}</Text>

                      {/* Like Button and Counter */}
                      <Center mt={15}>
                        <Button
                          variant="outline"
                          size="xs"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikes(post.id);
                          }}
                        >
                          Like ({post.likes})
                        </Button>
                      </Center>
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
