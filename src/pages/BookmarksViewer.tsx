import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark } from "@/components/Bookmark";
import { Search, Filter } from "lucide-react";
import type { BookmarkContent } from "@/utils/bookmark";
import { getAll } from "@/lib/storage";

// Mock data for bookmarks
const mockBookmarks = [
  {
    id: 1,
    title: "React Documentation",
    url: "https://react.dev",
    description:
      "The official React documentation with guides, tutorials, and API reference for building user interfaces.",
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: 2,
    title: "shadcn/ui Components",
    url: "https://ui.shadcn.com",
    description:
      "Beautiful and accessible component library built with Radix UI and Tailwind CSS.",
    tags: ["UI", "Components", "Tailwind"],
  },
  {
    id: 3,
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    description:
      "Complete guide to TypeScript covering types, interfaces, generics, and advanced features.",
    tags: ["TypeScript", "Programming", "Documentation"],
  },
  {
    id: 4,
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description:
      "Comprehensive resource for web developers with documentation on HTML, CSS, JavaScript, and Web APIs.",
    tags: ["Web Development", "Reference", "Tutorial"],
  },
  {
    id: 5,
    title: "GitHub",
    url: "https://github.com",
    description:
      "Platform for version control and collaboration, hosting millions of open-source projects.",
    tags: ["Git", "Version Control", "Collaboration"],
  },
  {
    id: 6,
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description:
      "Question and answer site for programmers to learn, share knowledge, and build careers.",
    tags: ["Q&A", "Programming", "Community"],
  },
  {
    id: 7,
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description:
      "Utility-first CSS framework for rapidly building custom user interfaces.",
    tags: ["CSS", "Framework", "Styling"],
  },
  {
    id: 8,
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description:
      "Production-ready React framework with hybrid static and server rendering, TypeScript support, and more.",
    tags: ["Next.js", "React", "SSR"],
  },
];

export function BookmarksViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");
  const [bookmarks, setBookmarks] = useState<BookmarkContent[]>([]);

  useEffect(() => {
    // Retrive all the bookmarks from the storage during mount
    const getAllBookmarks = async () => {
      const data = await getAll();
      setBookmarks(data as BookmarkContent[]);
    };

    getAllBookmarks();
  }, []);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        // TODO: Replace with a logger for debug purpose in development
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`,
        );

        /*
        If a new entry is added oldValue will be underfined and newValue will contain the set value,
        else if a entry is deleted, newValue will be undefined.
        */

        if (newValue) {
          setBookmarks((prev) => {
            if (
              prev.findIndex(({ timestamp }) => timestamp === Number(key)) == -1
            ) {
              return [...prev, newValue];
            }

            return prev;
          });
        } else {
          setBookmarks((prev) => {
            const index = prev.findIndex(
              ({ timestamp }) => timestamp === Number(key),
            );

            if (index !== -1) {
              return [...prev.slice(0, index), ...prev.slice(index + 1)];
            }

            return prev;
          });
        }
      }
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Bookmarks</h1>
        <p className="text-muted-foreground">
          Manage and organize your saved bookmarks
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="mostVisited">Most Visited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            Clear Filters
          </Button>
          <Button variant="outline" size="sm">
            Save Filter Preset
          </Button>
        </div>
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
          <Bookmark
            key={bookmark.timestamp}
            title={bookmark.title}
            url={bookmark.url}
            description={bookmark.description}
            tags={bookmark.tags}
          />
        ))}
      </div>

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
