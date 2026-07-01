import React, { useState, useEffect } from "react";
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  X,
  Cloud,
  Loader2,
  Search,
} from "lucide-react";

const API_KEY = "5910cddd874b620bb9c7e460fb2393ac";

const WeatherPage = ({ onClose }) => {
  const [city, setCity] = useState("Maharashtra");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      setWeather({
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        desc: data.weather[0].description,
        wind: data.wind.speed,
        windDeg: data.wind.deg,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        clouds: data.clouds.all,
        rain: data.rain ? data.rain["1h"] : 0,
        date: new Date().toDateString(),
        icon: data.weather[0].icon,
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const getIcon = (icon) => {
    if (!icon) return <Sun className="text-yellow-400" size={64} />;
    if (icon.startsWith("01"))
      return <Sun className="text-yellow-400" size={64} />;
    if (icon.startsWith("09") || icon.startsWith("10"))
      return <CloudRain className="text-blue-400" size={64} />;
    if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04"))
      return <Cloud className="text-gray-200" size={64} />;
    return <Sun className="text-yellow-400" size={64} />;
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-start p-6 z-50"
      aria-modal="true"
      role="dialog"
    >
      <button
        onClick={onClose}
        aria-label="Close weather overlay"
        className="absolute top-6 right-6 text-white hover:text-green-400 transition-colors"
      >
        <X size={28} />
      </button>

      <div className="mt-12 w-full max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white
           placeholder-gray-300 outline-none focus:ring-1 focus:ring-green-200"
        />
        <button
          onClick={() => fetchWeather(city)}
          disabled={loading}
          className="px-5 py-3 bg-green-400 text-gray-900 font-bold rounded-xl hover:bg-green-500 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Search />
          )}
        </button>
      </div>

      {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}

      {weather && (
        <div
          className="bg-gradient-to-br from-green-500/10 to-white/10 backdrop-blur-xl
          border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full text-white
           mt-8 flex flex-col items-center"
        >
          {getIcon(weather.icon)}
          <h2 className="text-6xl font-extrabold">
            {Math.round(weather.temp)}°C
          </h2>
          <p className="text-2xl font-semibold mb-1 capitalize">
            {weather.desc}
          </p>
          <p className="text-md text-gray-200 mb-6">{weather.date}</p>

          <div className="grid grid-cols-2 gap-6 text-center text-sm">
            <div className="flex flex-col items-center">
              <Wind size={20} />
              <span>{weather.wind} m/s</span>
            </div>
            <div className="flex flex-col items-center">
              <Droplets size={20} />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <Sun size={20} className="text-yellow-400" />
              <span>Feels like {Math.round(weather.feelsLike)}°C</span>
            </div>
            <div className="flex flex-col items-center">
              <Cloud size={20} className="text-gray-200" />
              <span>{weather.clouds}% Clouds</span>
            </div>
            <div className="flex flex-col items-center">
              <CloudRain size={20} className="text-blue-400" />
              <span>{weather.rain || 0} mm Rain</span>
            </div>
            <div className="flex flex-col items-center">
              <Sun size={20} className="text-orange-400" />
              <span>{weather.pressure} hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
