"use client"
import React, { useState } from "react";
import api from "@/lib/api";
import FileInput from "./FileInput";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AiOutlineClose } from "react-icons/ai";
import Assistant from "./Assistant";
import { useToast } from "@/components/ui/use-toast"



type ToggleFunction = () => void;

interface Props {
  toggle: ToggleFunction;
}


const CreatePost: React.FC<Props> = ({ toggle }) => {

  const { toast } = useToast()

  const [textareaValue, setTextareaValue] = useState("");
  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [assistantView, setAssistantView] = useState(false);
  const [visibility, setVisibility] = useState("PUBLIC");

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const isButtonDisabled = (): boolean => {
    return textareaValue.length === 0;
  };

  
  const shareNow = async () => {
    try {
      if (textareaValue && !mediaUploaded) {
        await createTextShare();
      } else if (textareaValue && mediaUploaded) {
        await handleImageVideoUpload();
      } else {
        console.log("Cannot create share with empty content");
      }
    } catch (error) {
      console.error("Error creating LinkedIn post:", error);
    }
  };

  const createTextShare = async () => {
    try {
      const requestBody = {
        content: textareaValue,
        visibility: visibility
      };

      const response = await api.post(
        'linkedIn/publish-textual-post',
        requestBody
      );

      if (response.status === 200) {
        console.log("Text share created:", response.data);
        toast({
          title: "Text post created",
          // description: "Friday, February 10, 2023 at 5:57 PM",
        })
      } else {
        console.error(
          "Error creating LinkedIn text share:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Error creating LinkedIn text share:", error);
    }
  };

  const handleImageVideoUpload = async (files: File[] = []) => {
    try {
      if (!files[0]) {
        console.error("No files provided for upload.");
        return;
      }
      else{
        setMediaUploaded(true)
      }
      const file = files[0]; 
      const mediaType = file.type.startsWith("image") ? "image" : "video";

      const formData = new FormData();
      formData.append("media", file);
      formData.append("content", textareaValue);
      formData.append("visibility", visibility);
      formData.append("mediaType", mediaType);

      const response = await api.post(
        "linkedIn/publish-complete-post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200) {
        console.log("Complete post published:", response.data);
      } else {
        console.error(
          "Error publishing complete post:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Error publishing complete post:", error);
    }
  };

  const schedulePost = () => {
    console.log("Schedule Post button clicked");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        {/* Assistant view */}
        {assistantView && (
        <div className="p-5 h-screen relative">
          <Assistant toggle={setAssistantView} setPromptText={()=>{""}} />
        </div>
      )}
      <div className="bg-white p-8 w-1/2 h-auto rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Create Post</h2>
          <button className="text-3xl font-bold" onClick={toggle}>
            <AiOutlineClose />
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
            <Button
            onClick={() => setAssistantView(!assistantView)}
              className="absolute top-1 left-36  px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg opacity-50 hover:opacity-100"
            >
              Use the AI Assistant
            </Button>
          )}
        </div>
        <div className="flex space-x-5">
          <h3 className="bold">Visibility</h3>
          <select
            className="outline-none  border-2 border-pink-500 rounded-lg"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="PUBLIC">Public</option>
            <option value="CONNECTIONS">Connections</option>
          </select>
        </div>
        <div>
          <FileInput 
           
          onUpload={handleImageVideoUpload} />
        </div>
        <div className="flex space-x-5 justify-end p-2">
          <Button disabled={isButtonDisabled()}>Save as draft</Button>
          <Button onClick={schedulePost} disabled={isButtonDisabled()}>
            Schedule Post
          </Button>
          <Button onClick={shareNow} disabled={isButtonDisabled()}>
            Share Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
