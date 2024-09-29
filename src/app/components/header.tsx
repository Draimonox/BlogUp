"use client";
import { Button, Center, CloseButton, Input } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { useState } from "react";

function Header() {
  const [textBox, setTextBox] = useState("");
  return (
    <>
      <header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Center h={100} style={{ width: "100vw" }}>
            <Input
              size="lg"
              radius="xl"
              style={{ width: "25%", marginLeft: "30%" }}
              placeholder="Handle"
              rightSectionPointerEvents="all"
              value={textBox}
              onChange={(event) => setTextBox(event.currentTarget.value)}
              leftSection={<IconAt size={20} />}
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setTextBox("")}
                  style={{ display: textBox ? undefined : "none" }}
                />
              }
            />
          </Center>
          <div style={{ display: "flex", gap: "10px", marginRight: "5%" }}>
            <Button variant="light" color="green" size="lg" radius="xl">
              BlogUp!
            </Button>
            <Button variant="light" color="gray" size="lg" radius="xl">
              Profile
            </Button>
            <Button variant="light" color="red" size="lg" radius="xl">
              Log out
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
