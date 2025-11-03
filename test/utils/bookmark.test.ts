import { describe, it, expect } from "vitest";
import { bookmarkToMarkdown, markdownToBookmark } from "@/utils/bookmark";
import { dedent as d } from "@/utils/dedent";
import type { Bookmark } from "@/utils/bookmark";

describe("bookmark-converter", () => {
  const mockBookmark: Bookmark = {
    title: "Test Bookmark",
    url: "https://example.com",
    timestamp: "2024-01-15T10:30:00Z",
    description: "This is a test description",
    notes: "Some important notes here",
  };

  describe("bookmarkToMarkdown", () => {
    it("should convert bookmark object to markdown with frontmatter", () => {
      const markdown = bookmarkToMarkdown(mockBookmark);

      expect(markdown).toContain("---");
      expect(markdown).toContain('title: "Test Bookmark"');
      expect(markdown).toContain('url: "https://example.com"');
      expect(markdown).toContain('timestamp: "2024-01-15T10:30:00Z"');
      expect(markdown).toContain("## Description");
      expect(markdown).toContain("This is a test description");
      expect(markdown).toContain("## Notes");
      expect(markdown).toContain("Some important notes here");
    });

    it("should handle empty description and notes", () => {
      const bookmark: Bookmark = {
        ...mockBookmark,
        description: "",
        notes: "",
      };

      const markdown = bookmarkToMarkdown(bookmark);

      expect(markdown).not.toContain("## Description");
      expect(markdown).not.toContain("## Notes");
    });

    it("should handle multiline description and notes", () => {
      const bookmark: Bookmark = {
        ...mockBookmark,
        description: "Line 1\nLine 2\nLine 3",
        notes: "Note 1\nNote 2",
      };

      const markdown = bookmarkToMarkdown(bookmark);

      expect(markdown).toContain("Line 1\nLine 2\nLine 3");
      expect(markdown).toContain("Note 1\nNote 2");
    });
  });

  describe("markdownToBookmark", () => {
    it("should parse markdown with frontmatter back to bookmark object", () => {
      const markdown = d`
        ---
        title: "Test Bookmark"
        url: "https://example.com"
        timestamp: "2024-01-15T10:30:00Z"
        ---

        ## Description

        This is a test description

        ## Notes

        Some important notes here
    `;

      const bookmark = markdownToBookmark(markdown);

      expect(bookmark).toEqual(mockBookmark);
    });

    it("should handle empty description and notes", () => {
      const markdown = d`---
        title: "Test Bookmark"
        url: "https://example.com"
        timestamp: "2024-01-15T10:30:00Z"
        ---

        ## Description



        ## Notes


      `;

      const bookmark = markdownToBookmark(markdown);

      expect(bookmark.title).toBe("Test Bookmark");
      expect(bookmark.description).toBe("");
      expect(bookmark.notes).toBe("");
    });

    it("should handle multiline content", () => {
      const markdown = d`
        ---
        title: "Test Bookmark"
        url: "https://example.com"
        timestamp: "2024-01-15T10:30:00Z"
        ---

        ## Description

        Line 1
        Line 2
        Line 3

        ## Notes

        Note 1
        Note 2
      `;

      const bookmark = markdownToBookmark(markdown);

      expect(bookmark.description).toBe("Line 1\nLine 2\nLine 3");
      expect(bookmark.notes).toBe("Note 1\nNote 2");
    });

    it("should throw error for invalid markdown format", () => {
      const invalidMarkdown = "No frontmatter here";

      expect(() => markdownToBookmark(invalidMarkdown)).toThrow(
        "Invalid markdown format: missing frontmatter",
      );
    });
  });

  describe("round-trip conversion", () => {
    it("should maintain data integrity through convert and parse cycle", () => {
      const markdown = bookmarkToMarkdown(mockBookmark);
      const parsedBookmark = markdownToBookmark(markdown);

      expect(parsedBookmark).toEqual(mockBookmark);
    });

    it("should handle special characters in content", () => {
      const bookmark: Bookmark = {
        title: "Bookmark with \"quotes\" and 'apostrophes'",
        url: "https://example.com?param=value&other=123",
        timestamp: "2024-01-15T10:30:00Z",
        description: "Description with **bold** and *italic* markdown",
        notes: "Notes with [link](https://example.com) and `code`",
      };

      const markdown = bookmarkToMarkdown(bookmark);
      const parsedBookmark = markdownToBookmark(markdown);

      expect(parsedBookmark).toEqual(bookmark);
    });
  });
});
