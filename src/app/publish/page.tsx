"use client";
import Calendar from "@/components/Calendar";
import Create from "@/components/Create";
import ManageTags from "@/components/ManageTags";
import Settings from "@/components/Settings";
import Sidebar from "@/components/Sidebar";
import { isUserLoggedIn } from "@/lib/utils";
import React, { useState } from "react";

const Page = () => {
  // Check if user is loggedIn, If No then redirect to login page
  isUserLoggedIn();

  const [activeScreen, setActiveScreen] = useState("Create");
  const renderComponent = () => {
    switch (activeScreen) {
      case "Create":
        return <Create />;
      case "Calendar":
        return <Calendar />;
      case "Settings":
        return <Settings />;
      case "Tags":
        return <ManageTags />;
      default:
        return <></>;
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      {" "}
      {/* Added h-screen to fill the screen height */}
      <div className="w-1/5 flex-shrink-0">
        <Sidebar setActiveScreen={setActiveScreen} />
      </div>
      <div className="flex-1 overflow-auto">
        {" "}
        {/* Added overflow-auto to enable scrolling */}
        {renderComponent()}
      </div>
    </div>
  );
};

export default Page;
