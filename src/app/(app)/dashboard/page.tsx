"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Message } from "@/models/User";
import { getSession } from "next-auth/react";
import Navbar from "@/components/ui/NavBar";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [acceptMessage, setAcceptMessage] = useState(true);
  const [message, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("Unknown");
  const link = "http://localhost:3000";
  const inpVal = `${link}/u/${username}`;
  const router = useRouter();
  const { toast } = useToast();

  const getMessages = useCallback(async () => {
    try {
      const { data: acceptData } = await axios.get("/api/accept-message");
      setAcceptMessage(acceptData.isAcceptingMessage);

      const { data: messageData } = await axios.get("/api/get-messages");
      setMessages(messageData.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    const getusername = async () => {
      const session = await getSession(); 
      if (!session) return;
      setUsername(session.user?.username || "unknown");
    };

    // Fetch username and messages when component mounts
    getusername().then(() => {
      getMessages();
    });
  }, [getMessages]); // Include getMessages as a dependency

  const handleCopyInput = () => {
    navigator.clipboard.writeText(inpVal);
    toast({
      title: "Link copied successfully!",
      description: "Your unique feedback link is now on the clipboard.",
    });
  };

  const handleSwitchClick = async () => {
    const newStatus = !acceptMessage;
    setAcceptMessage(newStatus); // Optimistically update UI
    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessage: newStatus,
      });
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.error("Error toggling message acceptance:", error);
      toast({
        title: "Error",
        description: "Failed to update message acceptance status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (createdAt: Date) => {
    try {
      const response = await axios.post("/api/delete-message", { createdAt, username });
      toast({
        title: response.data.message,
      });
      router.refresh(); // Refresh the page to see updated messages
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete the message.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen w-screen p-8 bg-gray-50"> 
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="text-4xl font-bold text-gray-800 my-6">
          Welcome to your Dashboard
        </div>
        <div className="mb-4">
          <p className="text-xl font-semibold">Copy your unique feedback link:</p>
          <div className="flex items-center space-x-4 my-4">
            <input
              value={inpVal}
              readOnly
              className="border border-gray-300 px-4 py-2 w-full rounded-lg bg-gray-100"
            />
            <Button onClick={handleCopyInput} className="px-6 py-2">
              Copy
            </Button>
          </div>
        </div>

        <div className="my-6">
          <div className="flex items-center">
            <Switch
              checked={acceptMessage}
              className="text-2xl"
              onClick={handleSwitchClick}
            />
            <div className="ml-4 text-lg font-semibold">
              Accept Messages: {acceptMessage ? "ON" : "OFF"}
            </div>
          </div>
        </div>

        <div className="my-6">
          <Button onClick={getMessages} className="px-6 py-2">
            Reload Messages
          </Button>
        </div>

        <div className="my-6">
          {message.length > 0 ? (
            message.map((msg) => (
              <div
                key={msg.createdAt.toString()}
                className="p-4 mb-4 bg-white border rounded-lg shadow-md flex flex-row justify-between items-center"
              >
                <div className="flex flex-col">
                  <p className="text-sm text-gray-600">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-lg">{msg.content}</p>
                </div>
                <div className="text-center">
                  <Button onClick={() => handleDelete(msg.createdAt)}>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
