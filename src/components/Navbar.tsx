
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Ticket Contester</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Chat</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">About</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
