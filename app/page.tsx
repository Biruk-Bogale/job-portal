import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <div>
      <Button>CLick Me</Button>

      <UserButton />
    </div>
  );
}

export default page;
