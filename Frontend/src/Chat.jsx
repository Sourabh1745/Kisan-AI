import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { MessageCircleDashed } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { chatTexts } from "./utils/Language";

function Chat() {
  const { newChat, prevChat, reply } = useContext(MyContext);
  const { language } = useLanguage();
  const [latestReply, setLatestReply] = useState(null);

  // Typing animation for last AI reply
  useEffect(() => {
    if (!reply) return;

    const words = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= words.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <div className="space-y-4 mb-32 px-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-rounded">
      {newChat && prevChat.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20 space-y-4 min-h-[40vh]">
          <MessageCircleDashed size={80} className="text-green-500" />
          <h1 className="text-center text-gray-300 text-2xl font-semibold">
            {chatTexts.startNewChatTitle[language]}
          </h1>
          <p className="text-center text-gray-400 max-w-md text-sm sm:text-base leading-relaxed">
            {chatTexts.startNewChatDesc[language]}
          </p>
        </div>
      )}

      {prevChat.map((chat, idx) => {
        const isLast = idx === prevChat.length - 1;
        return (
          <div
            key={idx}
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm sm:text-base whitespace-pre-wrap shadow-md ${
                chat.role === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-gray-800 text-gray-100 rounded-bl-none"
              }`}
            >
              {chat.role === "user" ? (
                chat.content
              ) : isLast ? (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply ?? chat.content}
                </ReactMarkdown>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Chat;
