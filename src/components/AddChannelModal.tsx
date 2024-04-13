"use client";
import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import api from "@/lib/api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";



const AddChannelModal = () => {
  const router = useRouter();
  const [codeExchanged, setCodeExchanged] = useState(false);


  



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
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    const returnedState = urlParams.get("state");

    if (authorizationCode && returnedState && !codeExchanged) {
      // Set the codeExchanged flag to true to prevent further processing
      setCodeExchanged(true);
      exchangeAuthorizationCodeForToken(authorizationCode, returnedState);
      window.history.replaceState({}, document.title, window.location.pathname);
      router.push("/publish");
    }
  }, []);

  const exchangeAuthorizationCodeForToken = async (
    authorizationCode: string | null,
    returnedState: string | null
  ) => {
    try {
      // Get authorization code and state from URL query parameters
      console.log("State:", returnedState, authorizationCode);
      const authState = localStorage.getItem("state");
      console.log("auth:", authState);
      if (authorizationCode && returnedState === authState) {
        // Make a POST request to exchange authorization code for access token
        const response = await api.post("linkedIn/generate-access-token", {
          authorizationCode,
        });
        console.log(response);
        // Get access token from response data
        if (response.status === 200) {
          const accessToken = response.data.message.access_token;
          // Store authorization code and access token as cookies
          setCookie("linkedInAccessToken", accessToken);
          console.log("authorisation", authorizationCode);
          console.log("accessToken", accessToken);

          // Calling post request to DB for access token channel name
          const createChannelResponse = await createChannel(accessToken);

          if (
            createChannelResponse?.status === 201 ||
            createChannelResponse?.status === 200
          ) {
            const linkedInData = await getLinkedInUser();
            const data = linkedInData.message;

            const updateChannelResponse = await api.put(
              "users/channel/update-channel",
              {
                channelName: "LinkedIn",
                sub: data.sub,
                userName: data.name,
                userEmail: data.email,
                profilePicture: data.picture,
              }
            );
            console.log(updateChannelResponse);
            if (updateChannelResponse.status === 200) {
              console.log("Channel updated:", updateChannelResponse.data);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sending access token and channelName to DB
  const createChannel = async (accessToken: string) => {
    try {
      const response = await api.post("users/channel/create-channel", {
        channelName: "LinkedIn",
        accessToken: accessToken,
      });
      console.log("Channel created:", response.data);
      return response;
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  const getLinkedInUser = async () => {
    //  make authenticated requests to LinkedIn API
    const accessToken = getCookie("linkedInAccessToken");
    const linkedInProfile = await api.post("linkedIn/get-user-info", {
      linkedInAccessToken: accessToken,
    });

    console.log(linkedInProfile.data);
    return linkedInProfile.data;
  };

  const handleYouTubeClick = () => {
    console.log("YouTube button clicked");
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

export default AddChannelModal;
