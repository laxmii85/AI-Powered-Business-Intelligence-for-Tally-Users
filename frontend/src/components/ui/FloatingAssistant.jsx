import React from "react";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

export default function FloatingAssistant() {
  return (
    <Link to="/ai" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-soft hover:bg-blue-700" aria-label="Open AI assistant">
      <Bot size={24} />
    </Link>
  );
}
