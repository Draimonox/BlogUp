//  ██████████                        ███  ███████████ █████               ██████████
// ░░███░░░░███                      ░░░  ░█░░░███░░░█░░███               ░░███░░░░███
//  ░███   ░░███ ████████   ██████   ████ ░   ░███  ░  ░███████    ██████  ░███   ░░███  ██████  █████ █████
//  ░███    ░███░░███░░███ ░░░░░███ ░░███     ░███     ░███░░███  ███░░███ ░███    ░███ ███░░███░░███ ░░███
//  ░███    ░███ ░███ ░░░   ███████  ░███     ░███     ░███ ░███ ░███████  ░███    ░███░███████  ░███  ░███
//  ░███    ███  ░███      ███░░███  ░███     ░███     ░███ ░███ ░███░░░   ░███    ███ ░███░░░   ░░███ ███
//  ██████████   █████    ░░████████ █████    █████    ████ █████░░██████  ██████████  ░░██████   ░░█████
// ░░░░░░░░░░   ░░░░░      ░░░░░░░░ ░░░░░    ░░░░░    ░░░░ ░░░░░  ░░░░░░  ░░░░░░░░░░    ░░░░░░     ░░░░░
"use client";

import Header from "./components/header";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import React, { useEffect } from "react";

function SearchPage() {
  const router = useRouter();
  useEffect(() => {
    const token = getCookie("token");
    console.log(token);
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Header />
    </>
  );
}

export default SearchPage;
