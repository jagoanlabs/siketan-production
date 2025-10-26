import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin";
  timestamp: string;
}

interface ChatPanelProps {
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatPanel = ({ showChat, setShowChat }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Selamat siang, Admin. Saya ingin menanyakan data musim tanam untuk komoditas padi di Kabupaten Ngawi, apakah sudah tersedia?",
      sender: "user",
      timestamp: "09:00",
    },
    {
      id: 2,
      text: "Selamat siang! 🙌 Untuk data musim tanam padi di Kabupaten Ngawi, saat ini sudah tersedia. Anda bisa mengaksesnya melalui menu Data Pertanian > Musim Tanam > Pilih Komoditas Padi dan Lokasi Ngawi. Silakan dicek ya, Bapak/Ibu.",
      sender: "admin",
      timestamp: "09:01",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [panelState, setPanelState] = useState<
    "minimized" | "normal" | "maximized"
  >("normal");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    setTimeout(() => {
      const adminReply: Message = {
        id: Date.now() + 1,
        text: "Terima kasih atas pertanyaan Anda. Kami akan segera memeriksanya.",
        sender: "admin",
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, adminReply]);
    }, 1500);
  };

  const togglePanelState = () => {
    setPanelState((prev) => {
      if (prev === "normal") return "maximized";
      if (prev === "maximized") return "minimized";

      return "normal";
    });
  };

  const contentVariants = {
    minimized: { opacity: 0, height: 0 },
    normal: { opacity: 1, height: "auto" },
    maximized: { opacity: 1, height: "auto" },
  };

  return (
    <AnimatePresence>
      {showChat && (
        <>
          {/* Overlay for maximized state */}
          {/* Overlay for maximized state */}
          {panelState === "maximized" && (
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-black/50"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setPanelState("normal")}
            />
          )}

          {/* Chat Panel */}
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0,
              width:
                panelState === "minimized"
                  ? 300
                  : panelState === "maximized"
                    ? "calc(100vw - 3rem)"
                    : 384,
              height:
                panelState === "minimized"
                  ? 60
                  : panelState === "maximized"
                    ? "calc(100vh - 6rem)"
                    : "32rem",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                when: panelState === "maximized" ? "beforeChildren" : undefined,
              },
            }}
            className={`fixed z-50 flex flex-col bg-white shadow-xl rounded-xl overflow-hidden ${
              panelState === "maximized" ? "inset-0 m-6" : "bottom-6 right-6"
            }`}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              transition: { duration: 0.2 },
            }}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              x: panelState === "maximized" ? "100%" : 0,
            }}
            style={{ originX: 1, originY: 1 }}
          >
            {/* Header */}
            <button
              className="flex items-center justify-between p-4 text-white bg-green-500 cursor-pointer"
              onClick={togglePanelState}
            >
              <div className="flex items-center gap-3">
                <FaRegCircleUser size={24} />
                <h2 className="text-lg font-semibold">Admin</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="p-1 transition-transform rounded-full hover:bg-black/20 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePanelState();
                  }}
                >
                  {panelState === "maximized" ? (
                    <FiMinimize2 size={18} />
                  ) : panelState === "normal" ? (
                    <FiMaximize2 size={18} />
                  ) : (
                    <FiMaximize2 size={18} />
                  )}
                </button>
                <button
                  className="p-1 transition-transform rounded-full hover:bg-black/20 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChat(false);
                  }}
                >
                  <RxCross2 size={20} />
                </button>
              </div>
            </button>

            {/* Chat Content */}
            <motion.div
              animate={
                panelState === "minimized"
                  ? "minimized"
                  : panelState === "maximized"
                    ? "maximized"
                    : "normal"
              }
              className="flex flex-col flex-1 overflow-hidden"
              variants={contentVariants}
            >
              {/* Messages */}
              <div
                ref={chatBodyRef}
                className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50"
              >
                <p className="text-xs text-center text-gray-400">
                  Hari ini,{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`${panelState === "maximized" ? "max-w-xl" : panelState === "minimized" ? "max-w-xs" : "max-w-xs"} px-4 py-3 text-sm rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-green-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 text-xs text-gray-400">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <div className="p-3 bg-white border-t border-gray-200">
                <form
                  className="flex items-center gap-2"
                  onSubmit={handleSendMessage}
                >
                  <input
                    className="w-full px-4 py-2 text-sm bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Tanyakan pada Ngawi.AI!"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className="p-3 text-white transition-all bg-green-500 rounded-full hover:bg-green-600 active:scale-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                    type="submit"
                  >
                    <IoSend size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
