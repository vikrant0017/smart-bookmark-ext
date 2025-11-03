import * as yaml from "js-yaml";

export interface Bookmark {
  title: string;
  url: string;
  timestamp: string;
  tags?: string[];

  description?: string;
  notes?: string;
}

export function bookmarkToMarkdown(bookmark: Bookmark): string {
  const frontmatter = {
    title: bookmark.title,
    url: bookmark.url,
    timestamp: bookmark.timestamp,
    tags: bookmark.tags,
  };

  const yamlContent = yaml.dump(frontmatter, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: true,
  });

  const m = [];

  m.push(`---\n${yamlContent.trim()}\n---\n`);
  if (bookmark.description) {
    m.push(`## Description\n\n${bookmark.description}\n`);
  }
  if (bookmark.notes) {
    m.push(`## Notes\n\n${bookmark.notes}\n`);
  }

  const markdown = m.join("");
  return markdown;
}

export function markdownToBookmark(markdown: string): Bookmark {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    throw new Error("Invalid markdown format: missing frontmatter");
  }

  const [, frontmatterContent, body] = match;
  const frontmatter = yaml.load(frontmatterContent, {
    schema: yaml.JSON_SCHEMA,
  }) as {
    title: string;
    url: string;
    timestamp: string;
    tags?: string[];
  };

  const descriptionMatch = body.match(
    /## Description\n\n([\s\S]*?)(?=\n## Notes|$)/,
  );
  const notesMatch = body.match(/## Notes\n\n([\s\S]*?)$/);

  const description = descriptionMatch ? descriptionMatch[1].trim() : "";
  const notes = notesMatch ? notesMatch[1].trim() : "";

  return {
    title: frontmatter.title,
    url: frontmatter.url,
    timestamp: frontmatter.timestamp,
    tags: frontmatter.tags,
    description,
    notes,
  };
}
