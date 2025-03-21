import React from "react";
import ReactPlayer from "react-player";
import Settings from "./settings";
import searchForSoundsByKeywords from "./searchForSoundsByKeywords";

interface GenerateVideoKeywordsProps {
  playerRef: React.RefObject<ReactPlayer>;
  settings: Settings;
  setSettings: (value: Settings) => void;
  setSnackbarOpen: (value: boolean) => void;
  setSnackbarMessage: (value: string) => void;
  setSnackbarSeverity: (value: "success" | "error") => void;
}

const generateVideoKeywords = ({
  playerRef,
  settings,
  setSettings,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}: GenerateVideoKeywordsProps): (() => Promise<void>) => {
  // Define the generator function that can be passed to searchForSoundsByKeywords
  return async () => {
    try {
      const player = playerRef.current;
      if (!player) return;

      const videoElement = player.getInternalPlayer() as HTMLVideoElement;
      if (!videoElement) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        const base64Image = imageData.split(",")[1];

        // Get existing keywords from settings
        const existingKeywords = settings.sound.keywords || [];

        // Get keywords from image analysis
        let found = false;
        let searchTimes = 0;
        while (!found && searchTimes < 5) {
          const data = await connectAPI(base64Image, existingKeywords);
          searchTimes++;

          if (data && data.choices && data.choices[0]?.message?.content) {
            try {
              // Get the raw content
              const content = data.choices[0].message.content;
              let jsonStr = content;

              // Remove markdown code block formatting if present
              if (content.includes("```")) {
                // Extract just the JSON part from the markdown code block
                const match = content.match(
                  /```(?:json)?\s*(\{[\s\S]*?})\s*```/,
                );
                if (match && match[1]) {
                  jsonStr = match[1];
                }
              }

              // Parse the cleaned JSON string
              const keywordsObj = JSON.parse(jsonStr);
              console.log("Parsed keywords:", keywordsObj);

              if (keywordsObj && keywordsObj.keywords) {
                setSnackbarMessage(
                  "BGM Keywords: " + keywordsObj.keywords.join(", "),
                );
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                // Update settings with keywords
                setSettings({
                  ...settings,
                  sound: {
                    ...settings.sound,
                    keywords: keywordsObj.keywords,
                  },
                });

                // Search for sounds using the keywords
                const result = await searchForSoundsByKeywords(
                  keywordsObj.keywords,
                  setSettings,
                  settings,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setSnackbarSeverity,
                );

                if (result) {
                  found = true;
                }
              }
            } catch (parseError) {
              console.error("Error parsing JSON:", parseError);
              console.log("Raw content:", data.choices[0].message.content);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error capturing video frame:", error);
    }
  };
};

const connectAPI = async (base64Image: string, existingKeywords: string[]) => {
  console.log("Existing keywords:", existingKeywords);
  const response = await fetch(
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sk-04c0b0ad099e407c84a0fba8e48131a2",
      },
      body: JSON.stringify({
        model: "qwen2.5-vl-72b-instruct",
        messages: [
          {
            role: "user",
            temperature: 0.7,
            content: [
              {
                type: "text",
                text:
                  "Analyze the given image and generate 2 specific simple English sound-related keywords for background music retrieval from Freesound. Focus on:\n" +
                  '1. Main objects producing sound (e.g., "rain", "fire")\n' +
                  '2. Environmental context (e.g., "forest", "city")\n' +
                  '3. Sound characteristics (e.g., "calm", "rhythmic")\n' +
                  '4. Meteorological elements (e.g., "storm", "windy")\n' +
                  '5. Human activities (e.g., "typing", "crowd")\n' +
                  "Format as JSON:\n" +
                  '{"keywords": ["keyword1", "keyword2"]}\n' +
                  "Avoid abstract concepts. Prioritize onomatopoeic and search-friendly terms. " +
                  `Do not use these existing keywords: ${existingKeywords.length > 0 ? existingKeywords.join(", ") : "none"}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    },
  );
  const data = await response.json();
  console.log("API response:", data);
  return data;
};

export default generateVideoKeywords;
