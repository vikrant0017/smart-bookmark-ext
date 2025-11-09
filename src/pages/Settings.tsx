import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

interface ModelProvider {
  id: string;
  name: string;
  requiresApiKey: boolean;
  requiresBaseUrl?: boolean;
  defaultBaseUrl?: string;
}

const MODEL_PROVIDERS: ModelProvider[] = [
  { id: "openai", name: "OpenAI", requiresApiKey: true },
  { id: "gemini", name: "Google Gemini", requiresApiKey: true },
  // { id: "claude", name: "Anthropic Claude", requiresApiKey: true },
  // {
  //   id: "ollama",
  //   name: "Ollama",
  //   requiresApiKey: false,
  //   requiresBaseUrl: true,
  //   defaultBaseUrl: "http://localhost:11434",
  // },
];

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

export function Settings() {
  const { theme, setTheme } = useTheme();
  // Initial state of true, to prevent the intial sync of local store with the intial state of the component
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    activeProvider: null,
    providerConfigs: {},
  });

  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set());
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch saved values from local store if available
    const fetchSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const res = await chrome.storage.local.get("settings");
        const settings: Settings = res?.settings;
        console.log("set", settings);
        if (settings) {
          setSettings(settings);
        }
      } catch (e) {
        console.error("failed to fetch settings from local store", e);
      } finally {
        // TODO: Should loading state be set of false if thre was error, which could potentially run the rist of overriding the
        // local storage values when syncing
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const syncSettings = async () => {
    console.log("syncing changes...");
    if (isLoadingSettings) {
      return;
    }
    await chrome.storage.local.set({ settings });
    console.log("Synced successfully");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setShowSavedMessage(false);

    try {
      await syncSettings();
      setShowSavedMessage(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApiKeyChange = (providerId: string, apiKey: string) => {
    setSettings((prev) => ({
      ...prev,
      providerConfigs: {
        ...prev.providerConfigs,
        [providerId]: {
          ...prev.providerConfigs[providerId],
          apiKey,
        },
      },
    }));
  };

  const handleBaseUrlChange = (providerId: string, baseUrl: string) => {
    setSettings((prev) => ({
      ...prev,
      providerConfigs: {
        ...prev.providerConfigs,
        [providerId]: {
          ...prev.providerConfigs[providerId],
          baseUrl,
        },
      },
    }));
  };

  const isProviderConfigured = (providerId: string): boolean => {
    const provider = MODEL_PROVIDERS.find((p) => p.id === providerId);
    const config = settings.providerConfigs[providerId];

    if (!provider) return false;

    if (provider.requiresApiKey && !config?.apiKey) return false;
    if (provider.requiresBaseUrl && !config?.baseUrl) return false;

    return true;
  };

  const handleProviderToggle = (providerId: string, enabled: boolean) => {
    console.log("Provider toggle", providerId, enabled);
    if (enabled) {
      // Deactivate all other providers and activate this one
      setSettings((prev) => ({
        ...prev,
        activeProvider: providerId,
      }));

      // Auto-open dropdown if not configured
      if (!isProviderConfigured(providerId)) {
        setOpenProviders((prev) => new Set(prev).add(providerId));
      }
    } else {
      // Deactivate this provider
      setSettings((prev) => ({
        ...prev,
        activeProvider: null,
      }));
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    if (checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const toggleProviderOpen = (providerId: string) => {
    setOpenProviders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(providerId)) {
        newSet.delete(providerId);
      } else {
        newSet.add(providerId);
      }
      return newSet;
    });
  };

  const getProviderBaseUrl = (providerId: string): string => {
    const provider = MODEL_PROVIDERS.find((p) => p.id === providerId);
    return (
      settings.providerConfigs[providerId]?.baseUrl ||
      provider?.defaultBaseUrl ||
      ""
    );
  };

  const getProviderApiKey = (providerId: string): string => {
    return settings.providerConfigs[providerId]?.apiKey || "";
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p className="text-muted-foreground">Loading settings...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your AI model providers and preferences
          </p>
        </div>

        <Separator />

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode for a more comfortable viewing experience
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme == "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Model Provider Settings */}
        <Card>
          <CardHeader>
            <CardTitle>AI Model Providers</CardTitle>
            <CardDescription>
              Select your active AI model provider and configure settings. Only
              one provider can be active at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MODEL_PROVIDERS.map((provider, index) => (
              <div key={provider.id}>
                <Collapsible
                  open={openProviders.has(provider.id)}
                  onOpenChange={() => toggleProviderOpen(provider.id)}
                >
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <CollapsibleTrigger className="flex items-center hover:opacity-70 transition-opacity">
                        {openProviders.has(provider.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CollapsibleTrigger>
                      <div className="flex-1">
                        <div className="font-semibold">{provider.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {provider.requiresApiKey
                            ? "Requires API key"
                            : "No API key required"}
                          {provider.requiresBaseUrl && " • Base URL required"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.activeProvider === provider.id}
                      onCheckedChange={(checked) =>
                        handleProviderToggle(provider.id, checked)
                      }
                    />
                  </div>

                  <CollapsibleContent className="pl-7 pr-4 pb-4 space-y-4">
                    {provider.requiresApiKey && (
                      <div className="space-y-2">
                        <Label htmlFor={`${provider.id}-key`}>API Key</Label>
                        <Input
                          id={`${provider.id}-key`}
                          type="password"
                          placeholder={`Enter your ${provider.name} API key`}
                          value={getProviderApiKey(provider.id)}
                          onChange={(e) =>
                            handleApiKeyChange(provider.id, e.target.value)
                          }
                        />
                      </div>
                    )}

                    {provider.requiresBaseUrl && (
                      <div className="space-y-2">
                        <Label htmlFor={`${provider.id}-baseurl`}>
                          Base URL
                        </Label>
                        <Input
                          id={`${provider.id}-baseurl`}
                          type="text"
                          placeholder={provider.defaultBaseUrl}
                          value={getProviderBaseUrl(provider.id)}
                          onChange={(e) =>
                            handleBaseUrlChange(provider.id, e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Default: {provider.defaultBaseUrl}
                        </p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {index !== MODEL_PROVIDERS.length - 1 && <Separator />}
              </div>
            ))}
            <div className="flex flex-row-reverse">
              <div className="flex gap-3">
                {showSavedMessage && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Saved successfully!
                    </span>
                  </div>
                )}
                <Button onClick={handleSave} disabled={isSaving}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
