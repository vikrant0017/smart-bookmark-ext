import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "@/components/Bookmark";
import { ExternalLink, Calendar } from "lucide-react";
import type { BookmarkContent } from "@/lib/BookmarkContent";
import { getAll } from "@/lib/storage";

/* BOOKMARK CROPPING */
const DESCRIPTION_MAX_LENGTH = 200;
const TAGS_MAX_LENGTH = 5;

export function BookmarksViewer() {
  const [bookmarks, setBookmarks] = useState<BookmarkContent[]>([]);
  const [selectedBookmark, setSelectedBookmark] =
    useState<BookmarkContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Retrive all the bookmarks from the storage during mount
    const getAllBookmarks = async () => {
      const data = await getAll();
      setBookmarks(data as BookmarkContent[]);
    };

    getAllBookmarks();
  }, []);

  // useEffect(() => {
  //   chrome.storage.onChanged.addListener((changes, namespace) => {
  //     // TODO: Handle Syncing logic

  //   });
  // }, []);

  const handleBookmarkClick = (bookmark: BookmarkContent) => {
    setSelectedBookmark(bookmark);
    setIsDialogOpen(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Bookmarks</h1>
        <p className="text-muted-foreground">
          Manage and organize your saved bookmarks
        </p>
      </div>

      {/* Bookmarks Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {bookmarks.length} bookmarks
        </p>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.timestamp}
            onClick={() => handleBookmarkClick(bookmark)}
          >
            <Bookmark
              title={bookmark.title}
              url={bookmark.url}
              description={bookmark.description}
              tags={bookmark.tags}
              descMaxLength={DESCRIPTION_MAX_LENGTH}
              tagsMaxLength={TAGS_MAX_LENGTH}
            />
          </div>
        ))}
      </div>

      {/* Bookmark Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl pr-8">
              {selectedBookmark?.title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <ExternalLink className="h-4 w-4" />
              <a
                href={selectedBookmark?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {selectedBookmark?.url}
              </a>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Timestamp */}
            {selectedBookmark?.timestamp && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Saved on {formatDate(selectedBookmark.timestamp)}</span>
              </div>
            )}

            {/* Description */}
            {selectedBookmark?.description && (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedBookmark.description}
                </p>
              </div>
            )}

            {/* Notes */}
            {selectedBookmark?.notes && (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedBookmark.notes}
                </p>
              </div>
            )}

            {/* Tags */}
            {selectedBookmark?.tags && selectedBookmark.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {selectedBookmark.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button asChild className="flex-1">
                <a
                  href={selectedBookmark?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State (hidden when there are bookmarks) */}
      {bookmarks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No bookmarks found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
