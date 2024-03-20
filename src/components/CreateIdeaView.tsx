'use client'
import React, { useState } from "react";
import Tags from "./Tags";
import { Textarea } from "./ui/textarea";
import FileInput from "./FileInput";
import { Button } from "./ui/button";

type CreateIdeaViewProps = {
  toggle: () => void;
};

const CreateIdeaView = ({ toggle }: CreateIdeaViewProps) => {
  const [textContent, setTextContent] = useState<string>("");
  const [mediaUploaded, setMediaUploaded] = useState<boolean>(false); 

  const handleMediaUpload = () => {
    setMediaUploaded(true); 
  };

 

  return (
    <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-75 overflow-auto md:p-8">
      <div className=" mx-80 my-5 bg-white rounded-xl">
        {/* Heading - new Idea and Tags */}
        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center px-10 py-0">
            <span className="font-bold pr-5">New Idea</span>
            <Tags />
          </div>
          <div className="flex justify-end p-5">
            <button onClick={toggle} className="text-3xl font-bold">
              &times;
            </button>
          </div>
        </div>
        {/* Text layout to write */}
        <form className="p-2 px-6">
          <Textarea
            placeholder="Start working on the idea now...."
            rows={20}
            cols={200}
            className="border-none"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
            <FileInput onUpload={handleMediaUpload}  />
          {/* Save Idea and create post buttons */}
          <div className="flex justify-end p-5">
            <Button
              className="m-2 bg-blue-600"
              disabled={textContent.length === 0 && !mediaUploaded} 
            >
              Create Post
            </Button>
            <Button
              className="m-2"
              disabled={textContent.length === 0 && !mediaUploaded} 
            >
              Save Idea
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIdeaView;