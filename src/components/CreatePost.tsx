import React, { useState } from "react";
import axios from "axios";
import { ComboboxDemo } from "./ComboBox";
import FileInput from "./FileInput";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import Assistant from "./Assistant";
import { AiOutlineClose } from "react-icons/ai";

type ToggleFunction = () => void;

interface Props {
  toggle: ToggleFunction;
}

const CreatePost: React.FC<Props> = ({ toggle }) => {
  const [textareaValue, setTextareaValue] = useState("");
  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [assistantView, setAssistantView] = useState(false);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [author, setAuthor] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const isButtonDisabled = (): boolean => {
    return textareaValue.length === 0 && !mediaUploaded;
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
        author: `urn:li:person:${author}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: textareaValue
            },
            shareMediaCategory: "NONE"
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": visibility
        }
      };

      const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0"
          }
        }
      );

      console.log("Text share created:", response.data);
    } catch (error) {
      console.error("Error creating LinkedIn text share:", error);
    }
  };

  const handleImageVideoUpload = async () => {
    try {
      // Register the media
      const { uploadUrl, asset } = await registerMedia(File.type.startsWith("image") ? "image" : "video");

      // Upload the media
      await uploadMedia(uploadUrl, File);

      // Create the media share
      await createMediaShare(file.type.startsWith("image") ? "image" : "video", asset);

      setMediaUploaded(true);
    } catch (error) {
      console.error("Error handling media upload:", error);
    }
  };

  const registerMedia = async (mediaType: string) => {
    try {
      const registerUploadRequest = {
        recipes: [mediaType === "image" ? "urn:li:digitalmediaRecipe:feedshare-image" : "urn:li:digitalmediaRecipe:feedshare-video"],
        owner: `urn:li:person:${author}`,
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent"
          }
        ]
      };

      const response = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        { registerUploadRequest },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const { uploadUrl, asset } = response.data.value;
      return { uploadUrl, asset };
    } catch (error) {
      console.error("Error registering media:", error);
      throw error;
    }
  };

  const uploadMedia = async (uploadUrl: string, file: File) => {
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type
        }
      });
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  };

  const createMediaShare = async (mediaType: string, asset: string) => {
    try {
      const requestBody = {
        author: `urn:li:person:${author}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: textareaValue
            },
            shareMediaCategory: mediaType.toUpperCase(),
            media: [
              {
                status: "READY",
                media: `urn:li:digitalmediaAsset:${asset}`,
                title: {
                  text: "Your Media Title"
                }
              }
            ]
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": visibility.toUpperCase()
        }
      };

      const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0"
          }
        }
      );

      console.log("Media share created:", response.data);
    } catch (error) {
      console.error("Error creating media share:", error);
    }
  };

  const schedulePost = () => {
    // Implement logic to schedule the post
    console.log("Schedule Post button clicked");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      {assistantView && (
        <div className="p-5 h-screen relative">
          <Assistant toggle={setAssistantView} setPromptText={""} />
        </div>
      )}
      <div className="bg-white p-8 w-1/2 h-auto rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Create Post</h2>
          <div className="relative">
            <ComboboxDemo />
          </div>
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
          <select className="outline-none  border-2 border-pink-500 rounded-lg" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        <div>
          <FileInput onUpload={handleImageVideoUpload} />
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
