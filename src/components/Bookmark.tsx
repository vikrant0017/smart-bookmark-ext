import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookmarkProps {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  descMaxLength?: number; // max characters
  tagsMaxLength?: number; // max characters
}

export function Bookmark({
  title,
  url,
  description,
  tags,
  descMaxLength,
  tagsMaxLength,
}: BookmarkProps) {
  const desc =
    description &&
    description.length > (descMaxLength || Number.POSITIVE_INFINITY)
      ? description.substring(0, descMaxLength) + "..."
      : description;
  const filteredTags =
    tags && tags.length > (tagsMaxLength || Number.POSITIVE_INFINITY)
      ? [...tags.slice(0, tagsMaxLength), "more..."]
      : tags;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground break-all">
          {url}
        </CardDescription>
      </CardHeader>
      {description && tags && (
        <CardContent>
          {desc && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {desc}
            </p>
          )}
          {filteredTags && filteredTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
