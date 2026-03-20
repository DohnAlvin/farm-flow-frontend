import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { CloudSun, Droplets, Wind, CloudRain, Sun, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * A pure React weather widget. 
 * Currently uses mock data. Wire this up to your Django backend via standard fetch later!
 * @param {Object} props
 * @param {string} [props.location="Nairobi, Kenya"] - The location to display.
 */
export default function WeatherWidget({ location = "Nairobi, Kenya" }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Standard pure React data fetching pattern
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // PURE REACT WAY: Simulate a network request to your Django backend.
        // Replace this setTimeout with: const response = await fetch(`/api/weather/?loc=${location}`);
        await new Promise(resolve => setTimeout(resolve, 800)); 

        const mockDjangoResponse = {
          location: location,
          current: {
            temperature: 24,
            humidity: 62,
            wind_speed: 18,
            condition: "Partly Cloudy",
          },
          forecast: [
            { day: "Mon", high: 26, low: 16, condition: "Sunny" },
            { day: "Tue", high: 25, low: 15, condition: "Cloudy" },
            { day: "Wed", high: 22, low: 14, condition: "Rain" },
          ]
        };

        setWeather(mockDjangoResponse);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  // Helper to pick the right icon based on condition string
  const getWeatherIcon = (condition = "") => {
    const c = condition.toLowerCase();
    if (c.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-300" />;
    if (c.includes("sun") || c.includes("clear")) return <Sun className="w-8 h-8 text-yellow-400" />;
    return <CloudSun className="w-8 h-8 text-[#D4A373]" />;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white border-0 shadow-lg p-6 h-[320px] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-200/50 mb-2" />
        <p className="text-sm text-green-200/70 italic">Checking the skies...</p>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white border-0 shadow-lg p-6 h-[320px] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-rose-300 mb-2" />
        <p className="text-sm text-green-200/70">Weather data unavailable</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-xs underline opacity-60">Retry</button>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white border-0 shadow-lg overflow-hidden h-[320px]">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-green-200/70 text-xs font-bold uppercase tracking-widest">{weather.location}</p>
            <p className="text-xs text-green-300/40 font-medium">Local Outlook</p>
          </div>
          {getWeatherIcon(weather.current?.condition)}
        </div>

        <div className="flex items-end gap-2 mb-6">
          <span className="text-6xl font-bold tracking-tighter leading-none">
            {Math.round(weather.current?.temperature || 0)}°
          </span>
          <span className="text-green-100 text-sm font-medium pb-1 capitalize tracking-wide">
            {weather.current?.condition}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3 border border-white/5 transition-hover hover:bg-white/15">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Droplets className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <p className="text-[10px] text-green-200/50 font-bold uppercase">Humidity</p>
              <p className="text-sm font-bold tracking-tight">{weather.current?.humidity}%</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3 border border-white/5 transition-hover hover:bg-white/15">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Wind className="w-4 h-4 text-green-200" />
            </div>
            <div>
              <p className="text-[10px] text-green-200/50 font-bold uppercase">Wind</p>
              <p className="text-sm font-bold tracking-tight">{weather.current?.wind_speed} km/h</p>
            </div>
          </div>
        </div>

        {/* Forecast Section */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex justify-between items-center px-2">
              {weather.forecast.slice(0, 3).map((day, i) => (
                <div key={i} className="text-center group cursor-default">
                  <p className="text-[10px] text-green-200/40 font-bold uppercase mb-1">{day.day.substring(0, 3)}</p>
                  <p className="text-sm font-bold text-white group-hover:text-[#D4A373] transition-colors">{Math.round(day.high)}°</p>
                  <p className="text-[10px] text-green-300/30 font-medium">{Math.round(day.low)}°</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}