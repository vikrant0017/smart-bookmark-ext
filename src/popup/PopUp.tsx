import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bookmark, BookmarkCheck, LucideStars, Settings } from "lucide-react";
import { openBookmarks, openSettings } from "@/lib/helpers";
import type { BookmarkContent } from "@/lib/BookmarkContent";
import { useState, useEffect } from "react";
import { add } from "@/lib/storage";
import { GeminiLLM, OpenAILLM } from "@/lib/llms";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// TODO: Implement these into a seprate types file
interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
}

interface Settings {
  activeProvider: string | null;
  providerConfigs: {
    [key: string]: ProviderConfig;
  };
}

export function PopUp() {
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [isQuickBookmarked, setIsQuickBookmarked] = useState<boolean>(false);
  const [isSmartBookmarked, setIsSmartBookmarked] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    activeProvider: null,
    providerConfigs: {},
  });

  // TODO: subscribe for changes instead, to reflect the latest settings
  useEffect(() => {
    // Fetch saved values from local store if available
    const fetchSettings = async () => {
      const res = await chrome.storage.local.get("settings");
      const settings: Settings = res?.settings;
      if (settings) {
        setSettings(settings);
      }
      if (!settings.activeProvider) {
        setShowAlert(true);
      }
    };

    fetchSettings();
  }, []);

  const handleOpenBookmarks = () => {
    openBookmarks();
  };
  const handleOpenSettings = () => {
    openSettings();
  };

  const summarizeContent = async (content: string) => {
    const res = await chrome.storage.local.get("settings");
    const settings: Settings = res.settings;
    console.log("Settings", settings);

    const activeProvider = settings.activeProvider;
    console.log("Active Provider", activeProvider);
    if (!activeProvider) {
      console.error("No provider is set");
      return null;
    }

    const apiKey = settings?.providerConfigs[activeProvider].apiKey;
    console.log("API Key", apiKey);
    if (!apiKey) {
      console.error("No API Key Found for the provider");
      return null;
    }

    let llm;

    // TODO: Use a LLM Factory instead
    switch (activeProvider) {
      case "openai":
        llm = new OpenAILLM(apiKey);
        break;
      case "gemini":
        llm = new GeminiLLM(apiKey);
        break;
      default:
        console.error("Provider not found");
    }

    const airesponse = await llm?.summarize(content);
    return airesponse;
  };

  const handleQuickBookmarkPage = async () => {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0]; // Since only one tab is possible for the above query params, just a guess :)

    const currentTime = Date.now();
    const bookmark: BookmarkContent = {
      title: tab.title || "",
      url: tab.url || "",
      timestamp: currentTime,
    };

    /* Add bookmark to IndexedDB storage */
    const added = await add(bookmark);
    console.log("Added new bookmark", added);

    setIsQuickBookmarked(true);
  };

  const handleSmartBookmarkPage = async () => {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0]; // Since only one tab is possible for the above query params, just a guess :)

    /* Summarize */
    let airesponse;
    try {
      setIsSummarizing(true);
      console.log("sumamrizing");
      const response = await chrome.tabs.sendMessage(tab.id!, {
        type: "EXTRACT_CONTENT",
      });
      console.log("Response", response);
      airesponse = await summarizeContent(response.message);
      console.log("done sumamrizing");
    } catch (error) {
      // TODO: Display error message in UI
      console.error(error);
    } finally {
      setIsSummarizing(false);
    }

    const currentTime = Date.now();
    const bookmark: BookmarkContent = {
      title: tab.title || "",
      url: tab.url || "",
      timestamp: currentTime,
      description: airesponse?.summary,
      tags: airesponse?.tags,
    };

    /* Add bookmark to IndexedDB storage */
    const added = await add(bookmark);
    console.log("Added new bookmark", added);

    setIsSmartBookmarked(true);
  };

  return (
    <div className="w-[250px]">
      <Card className="border-0 shadow-none rounded-none">
        {/*<CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5" />
            Smart Bookmarks
          </CardTitle>
        </CardHeader>*/}
        <CardContent className="space-y-4">
          {/* Quick Action */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Quick Action
            </p>
            {!isQuickBookmarked ? (
              <Button
                onClick={handleQuickBookmarkPage}
                className="w-full justify-start"
                size="lg"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Quick Bookmark
              </Button>
            ) : (
              <Button
                disabled
                variant={"ghost"}
                className="w-full justify-start"
                size="lg"
              >
                <BookmarkCheck className="mr-2 h-4 w-4" />
                Added to Bookmarks
              </Button>
            )}

            {!isSmartBookmarked && !isSummarizing ? (
              <Button
                onClick={handleSmartBookmarkPage}
                disabled={!settings.activeProvider}
                className="w-full justify-start"
                size="lg"
              >
                <LucideStars className="mr-2 h-4 w-4" />
                Smart Bookmark
              </Button>
            ) : !isSmartBookmarked && isSummarizing ? (
              <Button disabled className="w-full justify-start" size="lg">
                <Spinner className="mr-2 h-4 w-4" />
                Summarizing...
              </Button>
            ) : (
              <Button
                disabled
                variant={"ghost"}
                className="w-full justify-start"
                size="lg"
              >
                <BookmarkCheck className="mr-2 h-4 w-4" />
                Added to Bookmarks
              </Button>
            )}
            {showAlert && (
              <Alert>
                <AlertDescription>
                  Configure your model provider in Settings to start using Smart
                  Bookmaring feature
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Navigation */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Navigation
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleOpenBookmarks}
                className="w-full justify-start"
                size="default"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                View bookmarks
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenSettings}
                className="w-full justify-start"
                size="default"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
