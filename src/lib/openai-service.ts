
import { toast } from "sonner";

// Rate limiting constants
const MAX_MESSAGES_PER_HOUR = 10;
const RATE_LIMIT_STORAGE_KEY = "parking-assistant-rate-limit";

interface RateLimitData {
  count: number;
  resetTime: number; // Timestamp when the counter resets
}

// Function to check and update rate limit
function checkRateLimit(): boolean {
  const now = Date.now();
  let rateLimitData: RateLimitData;
  
  // Get current rate limit data from localStorage
  const storedData = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  if (storedData) {
    rateLimitData = JSON.parse(storedData);
    
    // If the reset time has passed, reset the counter
    if (now > rateLimitData.resetTime) {
      rateLimitData = {
        count: 0,
        resetTime: now + 60 * 60 * 1000 // 1 hour from now
      };
    }
  } else {
    // Initialize new rate limit data if none exists
    rateLimitData = {
      count: 0,
      resetTime: now + 60 * 60 * 1000 // 1 hour from now
    };
  }
  
  // Check if rate limit is exceeded
  if (rateLimitData.count >= MAX_MESSAGES_PER_HOUR) {
    const minutesRemaining = Math.ceil((rateLimitData.resetTime - now) / (60 * 1000));
    toast.error(`Rate limit exceeded. You can send more messages in ${minutesRemaining} minutes.`);
    return false;
  }
  
  // Update and save rate limit data
  rateLimitData.count += 1;
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(rateLimitData));
  return true;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: { role: string; content: string }[],
  ticketImage: string | null = null
): Promise<string> {
  // Check rate limit before proceeding
  if (!checkRateLimit()) {
    return "You've reached the limit of 10 messages per hour. Please try again later.";
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

    // Send request to your own backend API instead of directly to OpenAI
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedMessages,
        ticketImage: ticketImage,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API error:", error);
      throw new Error(error.message || "Failed to get response");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}

export async function analyzeTicket(
  imageBase64: string,
  prompt: string = "Analyze this parking ticket and extract all relevant information including: ticket number, date/time issued, location, violation type, fine amount, and any other details that might help contest it."
): Promise<string> {
  // Check rate limit before proceeding
  if (!checkRateLimit()) {
    return "You've reached the limit of 10 messages per hour. Please try again later.";
  }

  try {
    // Send request to your own backend API instead of directly to OpenAI
    const response = await fetch("/api/analyze-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64,
        prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API error:", error);
      throw new Error(error.message || "Failed to analyze ticket");
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error analyzing ticket:", error);
    throw error;
  }
}

// Function to get remaining message count
export function getRemainingMessages(): { count: number, resetTime: number } {
  const now = Date.now();
  const storedData = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  
  if (!storedData) {
    return {
      count: MAX_MESSAGES_PER_HOUR,
      resetTime: 0
    };
  }
  
  const rateLimitData = JSON.parse(storedData) as RateLimitData;
  
  // If the reset time has passed, return max count
  if (now > rateLimitData.resetTime) {
    return {
      count: MAX_MESSAGES_PER_HOUR,
      resetTime: 0
    };
  }
  
  // Return remaining count
  return {
    count: MAX_MESSAGES_PER_HOUR - rateLimitData.count,
    resetTime: rateLimitData.resetTime
  };
}
