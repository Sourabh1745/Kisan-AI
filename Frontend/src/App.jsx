import Sidebar from "./Sidebar.jsx";
import Chatwindow from "./Chatwindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { LanguageProvider } from "./context/LanguageContext.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChat, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChat,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <LanguageProvider>
      <MyContext.Provider value={providerValues}>
        <div className="flex h-screen bg-gray-950 text-gray-100">
          <Sidebar />
          <Chatwindow />
        </div>
      </MyContext.Provider>
    </LanguageProvider>
  );
}

export default App;
