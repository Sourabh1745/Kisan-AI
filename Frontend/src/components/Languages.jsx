import { X, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Languages = ({ onClose }) => {
  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Marathi",
    "Gujarati",
    "Bengali",
    "Punjabi",
  ];

  const { setLanguage } = useLanguage();

  const selectLanguage = (lang) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50"
      aria-modal="true"
      role="dialog"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-green-400"
      >
        <X size={30} />
      </button>

      <div className="bg-gradient-to-br from-green-500/10 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-white">
        <h2 className="text-2xl font-semibold mb-8 text-center flex items-center justify-center gap-3">
          <Globe size={28} /> Select Language
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {languages.map((name, idx) => (
            <button
              key={idx}
              className="bg-white/20 rounded-2xl py-3 px-4 text-center font-semibold text-lg 
              hover:bg-white/40 hover:scale-105 hover:shadow-lg transition-all duration-300"
              onClick={() => selectLanguage(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Languages;
