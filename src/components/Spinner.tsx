import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps {
  className?: string;
  text?: string;
}

const Spinner = ({ className = "", text }: SpinnerProps) => {
  return (
    <div className={cn(" ", className)}>
      <div className="flex flex-col justify-center items-center h-full">
        <img
          className="h-16 w-16"
          src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
          alt=""
        />
        {text && (
          <p className="text-gray-700 text-xl font-bold p-5 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
