import { useRef, useEffect, useState, useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import { ScaleLoader } from "react-spinners";
import {
  User,
  LogOut,
  CloudSun,
  Languages,
  Send,
  Mic,
  LeafyGreen,
  Sun,
  Moon,
} from "lucide-react";
import WeatherPage from "./pages/WeatherPage.jsx";
import LanguagesPage from "./components/Languages.jsx";
import { useLanguage } from "./context/LanguageContext";
import ProfilePage from "./components/Profile.jsx";
import {
  placeholders,
  buttons,
  messages,
  menu,
  headers,
} from "./utils/Language.js";

function Chatwindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenweather, setIsOpenWeather] = useState(false);
  const [isOpenlanguage, setIsOpenLanguage] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenSchemes, setIsOpenSchemes] = useState(false);
  const [listening, setListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // toggle state

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { language } = useLanguage();
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // language mapping
  const langMap = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported!");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = langMap[language] || "en-IN";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setPrompt(transcript);
    };

    recognition.onend = () => {
      setListening(false);
      if (prompt.trim()) {
        getReply();
      }
    };

    recognitionRef.current = recognition;
  }, [language, prompt]);

  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, threadId: currThreadId }),
      });
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // 🟢 TTS
  useEffect(() => {
    if (reply) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = langMap[language] || "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }, [reply, language]);

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reply, loading]);

  return (
    <main
      className={`flex-1 flex flex-col ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {isOpenweather && <WeatherPage onClose={() => setIsOpenWeather(false)} />}
      {isOpenlanguage && (
        <LanguagesPage onClose={() => setIsOpenLanguage(false)} />
      )}

      {isOpenSchemes && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } p-6 rounded-xl max-w-lg w-full shadow-lg`}
          >
            <h2 className="text-xl font-bold mb-4">
              {menu.govermentScheme[language]}
            </h2>
            <p className="text-gray-400">
              यहां पर योजनाओं की जानकारी दिखाई जाएगी।
            </p>
            <button
              onClick={() => setIsOpenSchemes(false)}
              className="mt-4 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🟢 Navbar */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        } flex justify-between items-center px-6 py-4 border-b`}
      >
        {/* Left side */}
        <h1 className="text-lg font-semibold flex items-center gap-2 text-green-600">
          <LeafyGreen size={20} /> {headers.chatBotTitle[language]}
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* toggle button */}
          {isDarkMode ? (
            <Sun
              onClick={() => setIsDarkMode(false)}
              className="text-yellow-400 cursor-pointer"
              size={22}
            />
          ) : (
            <Moon
              onClick={() => setIsDarkMode(true)}
              className="text-gray-600 cursor-pointer"
              size={22}
            />
          )}

          <Languages
            onClick={() => setIsOpenLanguage(true)}
            className="cursor-pointer hover:text-green-500"
          />
          <CloudSun
            onClick={() => setIsOpenWeather(true)}
            className="cursor-pointer hover:text-green-500"
          />
          <div className="relative" onClick={() => setIsOpen(!isOpen)}>
            <User className="cursor-pointer hover:text-green-500" />
            {isOpenProfile && (
              <ProfilePage
                onClose={() => setIsOpenProfile(false)}
                user={user}
              />
            )}
            {isOpen && (
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } absolute right-0 mt-2 w-48 rounded-lg shadow-lg border`}
              >
                <div
                  onClick={() => setIsOpenProfile(true)}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-green-50 cursor-pointer"
                >
                  <User size={16} /> {menu.profileTitle[language]}
                </div>
                <div
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-green-50 cursor-pointer"
                >
                  <LogOut size={16} /> {menu.logout[language]}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <Chat />
        {loading && (
          <div className="flex justify-center mt-4">
            <ScaleLoader color="#22c55e" loading={loading} />
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Section */}
      <div className="p-4">
        <div
          className={`${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-300"
          } flex items-center rounded-full p-2 sm:p-3 px-4 sm:px-6 md:px-8 max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto shadow`}
        >
          <input
            className={`flex-1 bg-transparent outline-none text-base sm:text-lg md:text-xl ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
            placeholder={placeholders.chatInput[language]}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <button
            onClick={handleMicClick}
            className={`ml-2 p-4 rounded-full text-white ${
              listening
                ? "bg-red-500"
                : "bg-gradient-to-r from-green-500 to-emerald-600"
            }`}
            title={buttons.mic[language]}
          >
            <Mic size={20} />
          </button>
          <button
            onClick={getReply}
            className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full text-white hover:opacity-90"
            title={buttons.send[language]}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          {messages.disclaimer[language]}
        </p>
      </div>
    </main>
  );
}

export default Chatwindow;




