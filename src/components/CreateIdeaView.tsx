"use client";
import React, { useState } from "react";
import Tags from "./Tags";
import { Textarea } from "./ui/textarea";
import FileInput from "./FileInput";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from "@/lib/api";
import { Divide, Terminal } from "lucide-react";
import { AiOutlineClose } from "react-icons/ai";
import Assistant from "./Assistant";
import { FaWandMagicSparkles } from "react-icons/fa6";
import Spinner from "./Spinner";
type CreateIdeaViewProps = {
  toggle: () => void;
};
type alertType = {
  alert: "Success" | "Failure";
  alertMessage: string;
};
const CreateIdeaView = ({ toggle }: CreateIdeaViewProps) => {
  const [saving, setSaving] = useState(false);
  const [textContent, setTextContent] = useState<string>("");
  const [mediaUploaded, setMediaUploaded] = useState<boolean>(false);
  const [assistantView, setAssistantView] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState<alertType>();
  const handleMediaUpload = (files: File[]) => {
    setFiles(files);
    setMediaUploaded(true);
  };

  const handleCreatePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(textContent, mediaUploaded);
  };

  const handleSaveIdea = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      console.log("Save Idea", textContent, files[0]);
      if (!files[0]) {
        console.error("No files selected");
        return;
      }
      const formData = new FormData();
      formData.append("ideaContent", textContent);
      formData.append("ideaImage", files[0]);
      api.defaults.headers.post["Content-Type"] = "multipart/form-data";
      const response = await api.post("/ideas/create-idea", formData);
      if (response.status === 201) {
        console.log("Idea saved successfully");
        setTextContent("");
        setMediaUploaded(false);
        setFiles([]);
        setAlert({
          alert: "Success",
          alertMessage: "Idea saved successfully",
        });
        setTimeout(() => {
          toggle();
        }, 5000);
      }
      console.log("Response received: ", response);
    } catch (error) {
      setAlert({
        alert: "Failure",
        alertMessage: "Failed to save the idea. Please try again later.",
      });
      console.log(error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed flex justify-between items-center inset-0 z-50 bg-gray-200 bg-opacity-75 overflow-auto md:p-8">
      {alert && (
        <div className="fixed flex justify-center items-center  top-6 lg:left-40 lg:right-40">
          <Alert
            className={`${
              alert?.alert === "Success"
                ? "border border-green-500 text-green-500"
                : "border border-red-500 text-red-500"
            } p-5 w-96 rounded-xl top-0 z-auto`}
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>{alert?.alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      {assistantView && (
        <div className="p-5 h-screen relative">
          <Assistant toggle={setAssistantView} setPromptText={setTextContent} />
        </div>
      )}
      <div className="  bg-white rounded-xl">
        {/* Heading - new Idea and Tags */}
        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center px-10 py-0">
            <span className="font-bold pr-5">New Idea</span>
            <Tags />
          </div>
          <div className="flex justify-end p-5">
            {textContent.length === 0 || mediaUploaded ? (
              <button className="text-3xl font-bold" onClick={toggle}>
                <AiOutlineClose />
              </button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-3xl font-bold">
                    {" "}
                    <AiOutlineClose />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {"You'll lose all your changes, this can't be undone."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-900" onClick={toggle}>
                      Discard Changes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        {/* Text layout to write */}
        <div className="p-2 px-6">
          {saving && (
            <div className="fixed flex justify-center items-center inset-0 z-50 bg-gray-200 bg-opacity-75 overflow-auto md:p-8">
              <Spinner className="bg-none" text="Saving Idea..." />
            </div>
          )}
          <div>
            <div className="relative flex justify-center items-center">
              <Textarea
                placeholder="Start working on the idea now or "
                rows={20}
                cols={200}
                className="border-none"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              {!textContent && (
                <Button
                  onClick={() => setAssistantView(!assistantView)}
                  className="absolute top-1 left-60  px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg opacity-50 hover:opacity-100"
                >
                  <FaWandMagicSparkles />
                  Use the AI Assistant
                </Button>
              )}
            </div>

            <FileInput
              onUpload={handleMediaUpload}
              allowMultipleFiles={false}
            />
          </div>
          {/* Save Idea and create post buttons */}
          <div className="flex justify-end p-5">
            <Button
              className="m-2 bg-blue-600"
              disabled={textContent.length === 0 || !mediaUploaded}
              onClick={handleCreatePost}
            >
              Create Post
            </Button>
            <Button
              className="m-2"
              disabled={textContent.length === 0 || !mediaUploaded}
              onClick={handleSaveIdea}
            >
              Save Idea
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIdeaView;
