import Settings from "./settings";

// Freesound API response types
export interface FreesoundResult {
  id: number;
  name: string;
  previews: {
    "preview-hq-mp3": string;
    "preview-lq-mp3": string;
  };
  duration: number;
  username: string;
  url: string;
}

export interface FreesoundResponse {
  count: number;
  results: FreesoundResult[];
}

const searchForSoundsByKeywords = async (
  keywords: string[],
  setSettings: (value: Settings) => void,
  settings: Settings,
  setSnackbarOpen: (value: boolean) => void,
  setSnackbarMessage: (value: string) => void,
  setSnackbarSeverity: (value: "success" | "error") => void,
): Promise<FreesoundResult | null> => {
  if (!keywords || keywords.length === 0) {
    console.error("No keywords available for sound search");
    return null;
  }

  try {
    // Freesound API key
    const FREESOUND_API_KEY = "tNF2tKLnnGlGt15qih4C4NpjjLKQtbEjPeXaGME6";

    // Build search query from keywords (join with OR for better results)
    const searchQuery = keywords.join(" AND ");
    console.log("Searching Freesound with query:", searchQuery);
    setSnackbarMessage("Searching for sounds with keywords: " + searchQuery);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Search for sounds
    const response = await fetch(
      `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(searchQuery)}&fields=id,name,previews,duration,username,url&page_size=15&filter=duration:[1 TO 120]`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${FREESOUND_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Error searching for sounds:", response.statusText);
      return null;
    }

    const soundData = (await response.json()) as FreesoundResponse;
    console.log("Found sounds:", soundData);

    if (soundData.count > 0 && soundData.results.length > 0) {
      // Select a random sound from the results
      const randomIndex = Math.floor(
        Math.random() * Math.min(soundData.results.length, 10),
      );
      console.log(randomIndex);
      const selectedSound = soundData.results[randomIndex];

      // Get the high quality preview URL
      const soundUrl = selectedSound.previews["preview-hq-mp3"];

      console.log("Selected sound:", selectedSound.name, "URL:", soundUrl);

      // Update the settings with the selected sound URL
      setSettings({
        ...settings,
        sound: {
          ...settings.sound,
          keywords: keywords,
          sound_url: soundUrl,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 3200));
      setSnackbarOpen(true);
      setSnackbarMessage("Selected sound: " + selectedSound.name);
      setSnackbarSeverity("success");

      return selectedSound;
    } else {
      console.log("No sounds found matching the keywords");
      await new Promise((resolve) => setTimeout(resolve, 3200));
      setSnackbarOpen(true);
      setSnackbarMessage("No sounds found matching the keywords");
      setSnackbarSeverity("error");
      await new Promise((resolve) => setTimeout(resolve, 3200));
      return null;
    }
  } catch (error) {
    console.error("Error searching for sounds:", error);
    return null;
  }
};

export default searchForSoundsByKeywords;
