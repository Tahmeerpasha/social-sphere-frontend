import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FaCheck, FaCopy, FaWandMagicSparkles } from "react-icons/fa6";
import generateText from "@/lib/gemini";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Spinner from "./Spinner";

const Assistant = ({ toggle, setPromptText }) => {
  const [prompt, setPrompt] = useState("");
  const [aiText, setAiText] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const handlePromptGeneration = async () => {
    // Call the generateText function here
    setLoading(true);
    await generateText(prompt)
      .then((text) => {
        setPrompt("");
        setLoading(false);
        setAiText(text);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="bg-white w-fit h-full flex flex-col justify-start  p-10 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg flex items-center font-bold">
          {" "}
          <FaWandMagicSparkles />
          AI Assistant
        </h2>
        <button className="" onClick={() => toggle(false)}>
          <AiOutlineClose />
        </button>
      </div>
      <div className="flex flex-col items-start justify-between">
        <p className="p-1">What do you want to write about?</p>
        <Textarea
          rows={5}
          cols={20}
          placeholder="Eg. Promote my DSA course to get new registrations. Registration closes in 3 days."
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          value={prompt}
        />
      </div>
      <span className="p-2">
        Pro tip: Include key points, your target audience and your desired
        outcome for this post
      </span>
      <Button
        onClick={handlePromptGeneration}
        className="self-end"
        disabled={aiText.length > 0 || prompt.length === 0 || loading}
      >
        <FaWandMagicSparkles />
        <span>Generate</span>
      </Button>

      {loading ? (
        <Spinner />
      ) : (
        aiText && (
          <div className="p-2">
            <h2 className="font-bold">AI Generated Text</h2>
            <div className="p-2 text-pretty">
              <Spinner />
              <Textarea rows={15} cols={20} readOnly value={aiText} />
            </div>
            <div className="flex justify-between items-center p-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(aiText);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 3000);
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {copied ? <FaCheck color="green" /> : <FaCopy />}
                    </TooltipTrigger>
                    <TooltipContent>
                      {copied ? <p>Copied</p> : <p>Copy to Clipboard?</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
              <Button
                onClick={() => {
                  setPromptText(aiText);
                }}
              >
                Insert
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Assistant;
