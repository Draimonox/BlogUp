// src/app/profile/[username]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../components/header";
import { Center, Divider, Paper, Text } from "@mantine/core";
interface UserData {
  name: string;
  username: string;
  image: string;
  bio: string;
  posts: [];
}
interface Post {
  id: string;
  title: string;
  content: string;
}

const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (username) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/findUser?username=${username}`);
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Error:", errorData.error);
            throw new Error(errorData.error);
          }
          const data = await res.json();
          setUserData(data);
          setPosts([...data.posts]);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [username]);

  return (
    <>
      <Header />
      <div>
        {userData ? (
          <>
            <Text ta="center" td="underline" size="xl" fw={1000}>
              {userData.name}&apos;s Profile
            </Text>
            <Center>
              <Image
                src={userData.image}
                alt={`${userData.name}'s profile`}
                width={150}
                height={150}
                style={{ marginTop: "15px", marginBottom: "15px" }}
              />
            </Center>

            <Text ta="center">
              <strong>Username:</strong> @{userData.username}
            </Text>
            <Text ta="center">
              <strong>Bio: </strong> {userData.bio}
            </Text>
            <Divider my="md" variant="dashed" />
            <Text ta="center" fw={700}>
              Posts:
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
                    </li>
                  </Paper>
                </Center>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default UserProfile;
