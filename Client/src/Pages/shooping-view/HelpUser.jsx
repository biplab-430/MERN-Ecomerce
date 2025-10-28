import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage, clearChat, sendOrderChatMessage } from "../../store/ChatBot-slice/index";
import { sendContactMessage, resetContactState } from "../../store/Contact-Slice/index";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Loader2, MessageSquare, X } from "lucide-react";
import { toast } from "react-toastify";
import accimg from "../../assets/WhatsApp Image 2025-10-23 at 19.04.40_37f15664.jpg";
import Typing from "@/components/shooping-view/Typing";

// ====================== MAIN PAGE ======================
function HelpUser() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header Banner */}
      <div className="w-screen">
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={accimg}
            className="h-full w-full object-cover object-center"
            alt="account-banner"
          />
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-4 flex justify-between items-center border-b border-gray-700 pb-2">
        <h1 className="text-blue-400 text-2xl font-bold">
          Store Support Center
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <ChatBot />
        <ContactForm />
      </div>
    </div>
  );
}

// ====================== CHATBOT COMPONENT ======================
function ChatBot() {
  const dispatch = useDispatch();
  const { messages, isLoading, error } = useSelector((state) => state.ChatBot);
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");

 const handleSend = () => { if (input.trim()) { dispatch(sendChatMessage(input)); setInput(""); } };

  const handleClear = () => {
    dispatch(clearChat());
  };

  return (
    <Card className="w-full shadow-xl rounded-2xl border border-gray-700 bg-gray-800 text-gray-100 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-2">
        <CardTitle className="flex items-center gap-2 text-blue-400 text-lg font-semibold">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          ChatBot Assistant
        </CardTitle>
        <h5>{`welcome ... ${user?.userName || "Guest"}`.toUpperCase()}</h5>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-red-500 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[60vh] p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10 text-sm">
              💬 Ask me anything about product details or product related
            </p>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[75%] shadow">
                  {msg.user}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-bl-none max-w-[75%] shadow whitespace-pre-wrap">
                  {Array.isArray(msg.bot) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {msg.bot.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : typeof msg.bot === "string" && msg.bot.includes("\n") ? (
                    msg.bot.split("\n").map((line, i) => <p key={i}>{line}</p>)
                  ) : (
                    msg.bot
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center mt-2 items-center">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-gray-400 text-sm ml-2">
                Bot is typing...
              </span>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t border-gray-700 pt-3">
        <Input
          placeholder="Ask about stock, price, or orders..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ====================== CONTACT FORM COMPONENT ======================

function ContactForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.Contact);

  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "",
  });

  // ✅ Pre-fill user info
  useEffect(() => {
    if (user) {
      setContact((prev) => ({
        ...prev,
        username: user.userName?.toUpperCase() || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission with toast
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(sendContactMessage(contact)).unwrap();
      toast.success(result?.message || "Message sent successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      // ✅ Reset form after successful submission
      setContact({
        username: user?.userName?.toUpperCase() || "",
        email: user?.email || "",
        message: "",
      });
    } catch (err) {
      toast.error(err || "Failed to send message. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setTimeout(() => dispatch(resetContactState()), 3000);
    }
  };

  return (
    <Card className="w-full shadow-xl rounded-2xl border border-gray-700 bg-gray-800 text-gray-100 p-4">
      <CardTitle className="text-blue-400 text-lg font-semibold mb-4">
        Contact Us
      </CardTitle>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="username"
          placeholder="Username"
          value={contact.username}
          onChange={handleChange}
          required
          className="bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={contact.email}
          onChange={handleChange}
          required
          className="bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
        />

        <textarea
          name="message"
          placeholder="Your message..."
          value={contact.message}
          onChange={handleChange}
          required
          className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-lg p-2 resize-none h-32"
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Card>
  );
}


export default HelpUser;
