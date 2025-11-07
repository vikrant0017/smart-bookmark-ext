import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";

const PROMPT = "Summarize the content and extract relevant keywords as tags";

const SummarySchema = z.object({
  summary: z.string(),
  tags: z.array(z.string()),
});

type Summary = z.infer<typeof SummarySchema>;

export interface LLM {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summarize: (content: string, options: any) => Promise<Summary | null>;
}

export class OpenAILLM implements LLM {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async summarize(content: string) {
    const response = await this.client.responses.parse({
      model: "gpt-5-mini",
      reasoning: { effort: "minimal" },
      input: [
        {
          role: "system",
          content: `${PROMPT}`,
        },
        {
          role: "user",
          content: content,
        },
      ],
      text: {
        format: zodTextFormat(SummarySchema, "event"),
      },
    });

    return response.output_parsed;
  }
}

export class GeminiLLM implements LLM {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }
  async summarize(content: string) {
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${PROMPT}\n\n#Content:\n"""${content}"""\n`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(SummarySchema),
      },
    });

    if (response.text) {
      return SummarySchema.parse(JSON.parse(response.text));
    } else {
      return null;
    }
  }
}
