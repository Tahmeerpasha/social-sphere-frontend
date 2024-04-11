/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import React from "react";

const ChannelModal = ({ imgURL, name }: { imgURL: string; name: string }) => {
  return (
    <Button className="w-full flex items-center hover:cursor-pointer justify-start p-2 border dark:border-white border-black">
      <div className=" mx-2">
        <img
          src={imgURL}
          alt={name}
          width={25}
          height={25}
          className="rounded-full"
        />
      </div>
      <div>
        <h2>{name}</h2>
      </div>
    </Button>
  );
};

export default ChannelModal;
