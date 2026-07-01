import { X, User } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { profileTexts } from "../utils/Language.js";

const Profile = ({ onClose, user }) => {
  const { language } = useLanguage();

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
          <User size={28} /> {profileTexts.profileTitle[language]}
        </h2>

        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl text-green-400 font-bold">
            {user?.name?.[0] || "U"}
          </div>
          <h3 className="text-xl font-semibold">
            {user?.name || profileTexts.unknownUser[language]}
          </h3>
          <p className="text-gray-300 text-sm">
            {user?.email || profileTexts.noEmail[language]}
          </p>
        </div>

        <div className="mt-8 flex flex-col">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="flex justify-center items-center gap-3 bg-red-500/80 py-3 px-4 rounded-2xl font-semibold hover:bg-red-500 transition-all duration-300"
          >
            {profileTexts.logout[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
