// src/app/profile/[username]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../components/header";
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
            <h1>{userData.name}&apos;s Profile</h1>
            <Image
              src={userData.image}
              alt={`${userData.name}'s profile`}
              width={150}
              height={150}
            />
            <p>Username: @{userData.username}</p>
            <p>Bio: {userData.bio}</p>
            <h2>Posts:</h2>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </li>
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
