"use client";
import React, { useEffect, useState } from "react";
import { isUserLoggedIn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  createChannel,
  exchangeAuthorizationCodeForToken,
} from "./linkedIn-helper";
import { trySampleRequest } from "./youtube-helper";

const Page = () => {
  const router = useRouter();
  const [codeExchanged, setCodeExchanged] = useState(false);
  const [channelCreated, setChannelCreated] = useState(false);

  const generateRandomState = () => {
    // Generate a random string to use as the state parameter
    return Math.random().toString(36).substring(2);
  };

  const handleLinkedInClick = async () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;
      const scope = process.env.NEXT_PUBLIC_LINKEDIN_SCOPE;

      // Generate a random state value
      const state = generateRandomState();
      // Set the state value
      localStorage.setItem("state", state);
      const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

      // Redirect the user to the LinkedIn authorization URL
      window.location.href = authorizationUrl;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthenticationsForLinkedInAndYoutube = async () => {
      isUserLoggedIn();
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get("code");
      const returnedState = urlParams.get("state");

      // Extract access token from hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const youtubeAccessToken = hashParams.get("access_token");
      console.log("Youtube token:", youtubeAccessToken);

      if (authorizationCode && returnedState && !codeExchanged) {
        // Set the codeExchanged flag to true to prevent further processing
        setCodeExchanged(true);
        await exchangeAuthorizationCodeForToken(
          authorizationCode,
          returnedState
        );
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        router.push("/publish");
      }

      // Check if channel has been created already
      if (youtubeAccessToken && !channelCreated) {
        createChannel("YouTube", youtubeAccessToken);
        // Set channelCreated to true to prevent multiple requests
        setChannelCreated(true);
      }
    };
    checkAuthenticationsForLinkedInAndYoutube();
  }, []);

  const handleYouTubeClick = () => {
    console.log("YouTube button clicked");
    trySampleRequest();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center pt-40">
        Add New Social Account
      </h2>
      <div className="flex p-5 justify-center items-center ">
        <Button
          onClick={handleLinkedInClick}
          className="bg-blue-500 hover:bg-blue-700 text-white m-5 rounded-lg transition duration-300"
        >
          LinkedIn
        </Button>
        <Button
          onClick={handleYouTubeClick}
          className="bg-red-500 hover:bg-red-600 text-white m-5 rounded-lg transition duration-300"
        >
          YouTube
        </Button>
      </div>
    </div>
  );
};

export default Page;
