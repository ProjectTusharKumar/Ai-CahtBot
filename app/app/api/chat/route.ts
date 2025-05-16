import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // You would typically verify the user's authentication here
  // const token = req.headers.get("Authorization")?.split(" ")[1];
  // if (!token) return new Response("Unauthorized", { status: 401 });

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  })

  return result.toDataStreamResponse()
}
