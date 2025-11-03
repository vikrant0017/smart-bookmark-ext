import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bookmark, BookmarkCheck, Settings } from "lucide-react";
import { openBookmarks } from "@/lib/helpers";

export function PopUp() {
  const handleOpenBookmarks = () => {
    openBookmarks();
  };

  return (
    <div className="w-[250px] bg-background">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5" />
            Smart Bookmarks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Action */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Quick Action
            </p>
            <Button className="w-full" size="lg">
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmark this page
            </Button>
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
