
import React from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="grid md:grid-cols-12 gap-6 h-full">
          <Card className="col-span-12 md:col-span-8 md:col-start-3 shadow-md overflow-hidden flex flex-col h-[calc(100vh-132px)]">
            <ChatInterface />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
