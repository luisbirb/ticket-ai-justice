
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About: React.FC = () => {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Ticket Contester</h1>
        </div>
      </div>

      <div className="prose prose-blue max-w-none">
        <h2>About Ticket Contester</h2>
        <p>
          Ticket Contester is an AI-powered assistant designed to help you fight unfair parking tickets. 
          Our system provides guidance on contesting your tickets based on legal precedents and common defense strategies.
        </p>

        <h3>How It Works</h3>
        <ol>
          <li>Upload a photo of your parking ticket</li>
          <li>Describe the circumstances of your ticket</li>
          <li>Our AI will analyze your situation and provide personalized guidance</li>
          <li>Follow the suggested steps to contest your ticket</li>
        </ol>

        <h3>Common Reasons to Contest a Parking Ticket</h3>
        <ul>
          <li>Missing or unclear signage</li>
          <li>Broken parking meters</li>
          <li>Emergency situations</li>
          <li>Incorrect information on the ticket</li>
          <li>Vehicle was legally parked</li>
          <li>The ticket was issued to the wrong vehicle</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>When properly contested, many parking tickets can be dismissed</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Studies show that up to 40% of contested parking tickets are dismissed when properly challenged.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Evidence is crucial for successful contests</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Take photos of the parking spot, relevant signs, and any other evidence that supports your case.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ticket Contester provides information and guidance but does not offer legal advice. 
            Results may vary, and there's no guarantee that contesting your ticket will result in dismissal. 
            Always consult with a legal professional for specific legal advice.
          </p>
        </CardContent>
      </Card>

      <Link to="/">
        <Button className="w-full">Return to Chat Assistant</Button>
      </Link>
    </div>
  );
};

export default About;
