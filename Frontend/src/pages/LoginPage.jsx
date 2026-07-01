import { useState } from "react";
import axios from "axios";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        formData
      );
      const { token, user, message } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage(message || "Login successful!");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center min-h-screen
        bg-gradient-to-tr from-green-900 via-black to-lime-950"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="max-w-md w-full bg-gradient-to-br from-green-600/10 to-white/10
          backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl
          p-8 space-y-8 flex flex-col items-center transition-all duration-300"
      >
        <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-800 p-4 shadow-lg mb-2">
          <LogIn size={38} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-2 text-center tracking-tight">
          Welcome Back
        </h2>

        <p className="text-gray-300 text-center text-sm mb-4">
          Log in to continue to{" "}
          <span className="font-semibold text-green-400">KisanAi</span>.
        </p>

        {message && (
          <div className="w-full text-center mb-4 text-sm text-red-600 font-medium">
            {message}
          </div>
        )}

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
              size={20}
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="pl-10 pr-3 py-3 border border-green-200 rounded-lg w-full
                bg-gradient-to-r from-white via-lime-50 to-white
                focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
              size={20}
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 py-3 border border-green-200 rounded-lg w-full
                bg-gradient-to-r from-white via-lime-50 to-white
                focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="text-green-600" size={20} />
              ) : (
                <Eye className="text-green-600" size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-800
              via-emerald-500 to-lime-400 shadow-md text-white font-semibold flex
              items-center justify-center gap-2 mt-2 hover:opacity-90 transition disabled:opacity-60"
          >
            <LogIn size={20} />
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <hr className="w-2/3 border-gray-700 my-2" />

        <div className="w-full flex flex-col items-center text-xs gap-1">
          <Link
            to="/signup"
            className="text-green-500 hover:underline font-medium transition"
          >
            Don't have an account?{" "}
            <span className="underline">Create an account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
