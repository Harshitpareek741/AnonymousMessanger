"use client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/ui/NavBar";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for when sending message
  const params = useParams<{ username: string }>();
  const { username } = params;
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true); // Start loading when sending message
      const response = await axios.post("/api/send-message", { username, message });
      toast({
        title: response?.data.message,
      });
      setMessage(""); // Clear message after sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="h-screen w-screen ">
      <NavBar/>
   
    <div className="flex items-center justify-center bg-gray-50 p-4">
      
      <div className="max-w-lg w-full bg-white shadow-lg p-6 rounded-lg">
        <div className="text-xl font-semibold mb-4 text-center">
          Send Message to @{username}
        </div>
        <textarea
          name="message"
          id="message"
          value={message}
          onChange={handleOnChange}
          placeholder="Type your message..."
          className="border border-gray-300 rounded-lg w-full h-40 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleSendMessage}
            disabled={loading} // Disable button during loading
            className="px-6 py-2"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SendMessage;
