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
}

export function Bookmark({ title, url, description, tags }: BookmarkProps) {
  console.log("Bookmark props", title, url, description, tags);
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
          {description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
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
