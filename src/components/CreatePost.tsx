"use client";
import React, { useState } from "react";
import { ComboboxDemo } from "./ComboBox";
import FileInput from "./FileInput";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { SelectBox } from "./SelectBox";

type ToggleFunction = () => void;

interface Props {
  toggle: ToggleFunction;
}

const CreatePost: React.FC<Props> = ({ toggle }) => {
  const [textareaValue, setTextareaValue] = useState("");
  const [mediaUploaded, setMediaUploaded] = useState(false);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const handleMediaUpload = () => {
    setMediaUploaded(true);
  };

  const isButtonDisabled = (): boolean => {
    return textareaValue.length === 0 && !mediaUploaded;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 w-1/2 h-auto rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Create Post</h2>
          <div className="relative">
            <ComboboxDemo />
          </div>
          <button className="text-3xl font-bold" onClick={toggle}>
            &times;
          </button>
        </div>
        <div className="relative">
          <Textarea
            placeholder="Start writing or"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
            rows={20}
            cols={50}
            value={textareaValue}
            onChange={handleTextareaChange}
          ></Textarea>
          {!textareaValue && (
            <button className="absolute top-1 left-36  px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg opacity-50 hover:opacity-100">
              Use the AI Assistant
            </button>
          )}
        </div>
        <div>
          <FileInput onUpload={handleMediaUpload} />
        </div>

        {/* Bottom buttons */}
        <div className="flex space-x-5 justify-end p-2">
          <Button disabled={isButtonDisabled()}>Save as draft</Button>
          <SelectBox />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
