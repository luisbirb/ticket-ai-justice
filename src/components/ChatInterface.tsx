
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { generateChatResponse } from "@/lib/openai-service";
import TicketUpload from "./TicketUpload";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticketImage, setTicketImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "Hi there! I'm your parking ticket assistant. Tell me about your ticket situation, and I'll help you contest it. You can also upload a photo of your ticket for analysis.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleTicketUpload = (imageDataUrl: string | null) => {
    setTicketImage(imageDataUrl);
    
    if (imageDataUrl) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: "I've uploaded my ticket for analysis.",
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for uploading your ticket! I'll analyze it to help with your case. Could you tell me more about where and when you received this ticket, and why you believe it should be contested?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" && !ticketImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get previous messages for context
      const messageHistory = messages
        .slice(-4)
        .map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        }));
      
      // Add current user message
      messageHistory.push({ role: "user", content: inputValue });

      const responseContent = await generateChatResponse(messageHistory, ticketImage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Clear the ticket image after it's been processed
      if (ticketImage) {
        setTicketImage(null);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-card shadow-sm border-b flex items-center gap-2">
        <Ticket className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Parking Ticket Assistant</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-3">
              <div className="typing-dots">Thinking</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <TicketUpload onImageUpload={handleTicketUpload} />
        
        <div className="flex items-end gap-2 mt-2">
          <Textarea
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[180px] resize-none"
            disabled={isLoading}
          />
          <Button
            className={cn("h-[60px] w-[60px]", isLoading && "opacity-50")}
            onClick={handleSendMessage}
            disabled={isLoading || (inputValue.trim() === "" && !ticketImage)}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

// For the Avatar that wasn't imported
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
