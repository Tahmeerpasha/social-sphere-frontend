import dynamic from "next/dynamic";
import { useState } from "react";
import { SchedulerEvent } from "smart-webcomponents-react";
import "smart-webcomponents-react/source/styles/smart.default.css";
import CreatePost from "./CreatePost";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

//Dynamically import the Smart.Scheduler component
const Scheduler = dynamic(() => import("smart-webcomponents-react/scheduler"), {
  ssr: false, //no server-side rendering
  loading: () => <Skeleton className="w-screen h-screen rounded-xl" />,
});

function Calendar() {
  const [createPostView, setCreatePostView] = useState<boolean>(false);
  const today = new Date(),
    todayDate = today.getDate(),
    currentYear = today.getFullYear(),
    currentMonth = today.getMonth(),
    dataSource: SchedulerEvent[] = [
      {
        label: "Google AdWords Strategy",
        dateStart: new Date(currentYear, currentMonth, todayDate, 9, 0),
        dateEnd: new Date(currentYear, currentMonth, todayDate, 10, 30),
        backgroundColor: "#E67C73",
      },
      {
        label: "New Brochures",
        dateStart: new Date(currentYear, currentMonth, todayDate - 1, 11, 30),
        dateEnd: new Date(currentYear, currentMonth, todayDate - 1, 14, 15),
        backgroundColor: "#8E24AA",
      },
      {
        label: "Brochure Design Review",
        dateStart: new Date(currentYear, currentMonth, todayDate + 2, 13, 15),
        dateEnd: new Date(currentYear, currentMonth, todayDate + 2, 16, 15),
        backgroundColor: "#039BE5",
      },
    ],
    currentTimeIndicator = true,
    shadeUntilCurrentTime = true,
    view = "day",
    views = [
      "day",
      "week",
      "month",
      "timelineDay",
      "timelineWeek",
      "timelineMonth",
    ],
    firstDayOfWeek = 1;

  const handleCreatePostView = () => {
    setCreatePostView(!createPostView);
  };
  return (
    <main className="mt-20 ml-80 p-1">
      <div className="flex justify-between items-center p-5">
        <div className="font-bold pr-5">Calendar</div>
        <Button onClick={handleCreatePostView}>Create Post</Button>
      </div>
      <Scheduler
        className={"w-full h-full"}
        id="scheduler"
        currentTimeIndicator={currentTimeIndicator}
        shadeUntilCurrentTime={shadeUntilCurrentTime}
        dataSource={dataSource}
        view={view}
        views={views}
        firstDayOfWeek={firstDayOfWeek}
      />
      {createPostView && <CreatePost toggle={handleCreatePostView} />}
    </main>
  );
}

export default Calendar;
