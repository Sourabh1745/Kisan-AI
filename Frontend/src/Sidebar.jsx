// Sidebar.jsx
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { Plus, Trash, MessageSquare, Shrub } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import {
  greeting,
  buttons,
  headers,
  footer,
  appName,
} from "./utils/Language.js";

// 📌 Market Price Modal
function MarketPriceModal({ isOpen, onClose }) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState(null);
  const [error, setError] = useState(null);

  const validPincode = (p) => /^\d{6}$/.test(p);

  const fetchPrices = async () => {
    setError(null);
    setPrices(null);

    if (!validPincode(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Kolhapur mandi demo data (10 crops) English + Marathi
      const demoData = {
        crops: [
          { name: "Onion (कांदा)", minPrice: 500, maxPrice: 1700, modal: 1000, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Tomato (टोमॅटो)", minPrice: 500, maxPrice: 1800, modal: 1200, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Brinjal (वांगी)", minPrice: 1000, maxPrice: 5000, modal: 3000, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Cabbage (कोबी)", minPrice: 400, maxPrice: 1000, modal: 700, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Cauliflower (फूलकोबी)", minPrice: 500, maxPrice: 1250, modal: 900, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Green Chilli (हिरवी मिरची)", minPrice: 1000, maxPrice: 4000, modal: 2500, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Lime (लिंबू)", minPrice: 1000, maxPrice: 4000, modal: 2500, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Fenugreek/Methi (मेथी)", minPrice: 2500, maxPrice: 9000, modal: 6000, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Coriander (कोथिंबीर)", minPrice: 1000, maxPrice: 4000, modal: 2500, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
          { name: "Apple (सफरचंद)", minPrice: 5000, maxPrice: 15000, modal: 7500, unit: "quintal", marketName: "Kolhapur Mandi", date: "15-09-2025" },
        ],
      };

      setTimeout(() => {
        setPrices(demoData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch prices.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-300">Market Prices</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => {
              setPincode("");
              setPrices(null);
              setError(null);
              onClose();
            }}
          >
            Close
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Enter Pincode</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.trim())}
              placeholder="e.g. 416003"
              className="flex-1 bg-gray-800 text-gray-200 placeholder-gray-500 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
            />
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-400 text-white shadow-sm border border-white/20 hover:shadow-md"
            >
              {loading ? "Loading..." : "Get Prices"}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>

        <div className="max-h-72 overflow-y-auto">
          {!prices && !loading && (
            <p className="text-sm text-gray-400">Enter a pincode and click "Get Prices".</p>
          )}

          {prices && prices.crops && prices.crops.length > 0 && (
            <div className="space-y-3">
              {prices.crops.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-800 rounded-lg border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-100 truncate">{c.name}</div>
                    <div className="text-xs text-gray-400">
                      Market: {c.marketName || "N/A"} • Date: {c.date || "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-300 font-medium">
                      ₹{c.modal ?? "-"} / {c.unit ?? "kg"}
                    </div>
                    <div className="text-xs text-gray-400">
                      Min: ₹{c.minPrice ?? "-"} • Max: ₹{c.maxPrice ?? "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 📌 Scheme Modal
function SchemeModal({ isOpen, onClose }) {
  const schemes = [
    {
      name: "PM-KISAN Samman Nidhi",
      desc: "Farmers get ₹6,000 per year in three installments. Helps with seeds, fertilizers, and household expenses.",
      link: "https://pmkisan.gov.in/",
    },
    {
      name: "PM Fasal Bima Yojana (PMFBY)",
      desc: "Crop insurance against natural calamities, pests, and diseases. Premium is subsidized by government.",
      link: "https://pmfby.gov.in/",
    },
    {
      name: "Soil Health Card Scheme",
      desc: "Provides soil health information (NPK & micronutrients) for balanced use of fertilizers and improved yield.",
      link: "https://soilhealth.dac.gov.in/",
    },
    {
      name: "Kisan Credit Card (KCC)",
      desc: "Quick and easy credit facility for crop production and allied activities at low interest rates.",
      link: "https://www.myscheme.gov.in/schemes/kcc",
    },
    {
      name: "National Mission on Sustainable Agriculture (NMSA)",
      desc: "Focuses on sustainable practices, water conservation, organic farming and climate resilience.",
      link: "https://agricoop.nic.in/en/Major/NPMSF/NMSA",
    },
    {
      name: "e-NAM (National Agriculture Market)",
      desc: "Online trading platform integrating APMCs across India for better price discovery and transparency.",
      link: "https://enam.gov.in/web/",
    },
    {
      name: "Rashtriya Krishi Vikas Yojana (RKVY)",
      desc: "Provides funds for agriculture and allied sectors, boosting production and farmers' income.",
      link: "https://rkvy.nic.in/",
    },
    {
      name: "Paramparagat Krishi Vikas Yojana (PKVY)",
      desc: "Promotes organic farming practices with financial support for clusters of farmers.",
      link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
    },
    {
      name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      desc: "Ensures water conservation and irrigation efficiency – 'Per Drop More Crop'.",
      link: "https://pmksy.gov.in/",
    },
    {
      name: "Agriculture Infrastructure Fund (AIF)",
      desc: "Financial support for cold storage, warehouses, food processing units and supply chain facilities.",
      link: "https://www.agriinfra.dac.gov.in/",
    },
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-300">Government Schemes</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {schemes.map((s, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-800 rounded-lg border border-white/5"
            >
              <div className="text-sm font-semibold text-gray-100">{s.name}</div>
              <p className="text-xs text-gray-400 mb-1">{s.desc}</p>
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-400 hover:underline"
              >
                {s.link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { language } = useLanguage();

  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`);
      const res = await response.json();
      const filteredData =
        res?.map?.((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
        })) || [];
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`
      );
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${threadId}`, {
        method: "DELETE",
      });
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className="w-80 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Shrub /> {appName[language]}
        </h1>
      </div>

      {storedUser && (
        <div
          className="relative overflow-hidden p-4 rounded-xl shadow-lg 
                     bg-gradient-to-br from-green-700/30 to-emerald-600/30 
                     backdrop-blur-md text-center mb-4 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white truncate">
            {storedUser.name}
          </h2>
          <p className="text-sm text-gray-300 mt-1">{greeting[language]}</p>
          <p className="text-xs text-gray-400 mt-1 truncate">
            {storedUser.email}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={createNewChat}
          className="flex items-center justify-center gap-2 
                 bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-400
                 text-white py-2 px-4 rounded-lg 
                 shadow-sm shadow-green-500/50
                 border border-white/20
                 hover:shadow-md hover:shadow-green-400/20"
        >
          <Plus size={18} /> {buttons.newChat[language]}
        </button>

        <button
          onClick={() => setIsMarketModalOpen(true)}
          className="flex items-center justify-center gap-2 
                 bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-400
                 text-white py-2 px-4 rounded-lg 
                 shadow-sm shadow-green-500/50
                 border border-white/20
                 hover:shadow-md hover:shadow-green-400/20"
        >
          <span className="text-lg font-semibold">₹</span> {buttons.marketPrice[language]}
        </button>

        <button
          onClick={() => setIsSchemeModalOpen(true)}
          className="flex items-center justify-center gap-2 
                 bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-400
                 text-white py-2 px-4 rounded-lg 
                 shadow-sm shadow-green-500/50
                 border border-white/20
                 hover:shadow-md hover:shadow-green-400/20"
        >
          🌱 {buttons.scheme ? buttons.scheme[language] : "Schemes"}
        </button>
      </div>

      <h2 className="text-gray-400 text-xs uppercase tracking-wide mt-6 mb-2">
        {headers.recentChats[language]}
      </h2>

      <ul className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {allThreads?.length > 0 ? (
          allThreads.map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => changeThread(thread.threadId)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                thread.threadId === currThreadId
                  ? "bg-gray-800 text-green-400"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="truncate">{thread.title}</span>
              </div>
              <Trash
                size={16}
                className="text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              />
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-4 text-center">
            No chats yet. Start a new conversation 🌟
          </p>
        )}
      </ul>

      <div className="text-xs text-center mt-6 p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-600/10 text-green-400">
        {footer.credit[language]}
      </div>

      <MarketPriceModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
      />

      <SchemeModal
        isOpen={isSchemeModalOpen}
        onClose={() => setIsSchemeModalOpen(false)}
      />
    </aside>
  );
}

export default Sidebar;



