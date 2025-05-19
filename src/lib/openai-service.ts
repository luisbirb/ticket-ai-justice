
import { toast } from "sonner";

// Temporary API key input - in a production app this should be handled server-side
let openAIKey: string | null = null;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: { role: string; content: string }[],
  ticketImage: string | null = null
): Promise<string> {
  // If no API key is set yet, show a prompt to enter one
  if (!openAIKey) {
    const key = prompt("Please enter your OpenAI API key to continue:");
    if (!key) {
      toast.error("API key is required to use the chatbot");
      return "I need an API key to assist you. Please reload the page and provide your OpenAI API key when prompted.";
    }
    openAIKey = key;
  }

  try {
    const systemMessage: ChatMessage = {
      role: "system",
      content:
        "You are a helpful assistant specializing in helping users contest parking tickets. " +
        "Provide information about parking laws, the contestation process, and help craft effective appeal letters. " +
        "Ask clarifying questions to understand the specific situation. " +
        "Avoid giving legal advice, but suggest common defenses backed by facts. " +
        "Be empathetic, clear, and detail-oriented."
    };

    // Format messages for the API
    const formattedMessages: ChatMessage[] = [
      systemMessage,
      ...messages.map((msg) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Add information about the image if provided
    if (ticketImage) {
      formattedMessages.push({
        role: "user",
        content: "I've uploaded a photo of my parking ticket for analysis.",
      });
    }

    // Create the API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(error.error?.message || "Failed to get response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

export async function analyzeTicket(
  imageBase64: string,
  prompt: string = "Analyze this parking ticket and extract all relevant information including: ticket number, date/time issued, location, violation type, fine amount, and any other details that might help contest it."
): Promise<string> {
  if (!openAIKey) {
    const key = prompt("Please enter your OpenAI API key to continue:");
    if (!key) {
      toast.error("API key is required to analyze ticket images");
      return "API key required for image analysis.";
    }
    openAIKey = key;
  }

  try {
    // For now, this is a simplified version since we'd need a more complex implementation
    // to handle image analysis with OpenAI's API
    // In a production app, you'd send the image to OpenAI's vision models
    
    // This would be replaced by actual API call in production
    return "Based on the ticket image, this appears to be a parking violation for [reason]. The ticket was issued on [date] at [location]. The fine amount is [amount]. Potential contestation arguments might include: [arguments].";
  } catch (error) {
    console.error("Error analyzing ticket:", error);
    throw error;
  }
}
