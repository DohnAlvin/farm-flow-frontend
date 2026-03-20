// @ts-nocheck
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api"; // Traditional Django API bridge
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  CloudSun, Droplets, Wind, Thermometer, Search, 
  Loader2, Sun, CloudRain, Cloud, Snowflake, MapPin 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Weather() {
  const [searchInput, setSearchInput] = useState("Nairobi, Kenya");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [farmTips, setFarmTips] = useState([]);

  // 🌩️ Fetching Weather from your Django Backend
  const fetchWeather = async () => {
    if (!searchInput) return;
    setLoading(true);

    try {
      // In a traditional setup, your Django view handles the logic of 
      // calling a weather API and generating tips via a service layer.
      const response = await api.get(`/weather/?location=${encodeURIComponent(searchInput)}`);
      
      // Expected Django response structure should match your UI needs
      setWeather(response.weather);
      setFarmTips(response.tips || []);
    } catch (error) {
      console.error("Weather fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getConditionIcon = (condition) => {
    const c = (condition || "").toLowerCase();
    if (c.includes("rain") || c.includes("storm")) return <CloudRain className="text-blue-400" />;
    if (c.includes("cloud") || c.includes("overcast")) return <Cloud className="text-stone-400" />;
    if (c.includes("snow")) return <Snowflake className="text-blue-200" />;
    return <Sun className="text-amber-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Weather Center</h1>
          <p className="text-stone-500 mt-1 font-medium italic">Precision climate data for agricultural planning</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchWeather(); }} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Farm location..."
              className="pl-10 bg-white border-stone-200 rounded-xl focus:ring-emerald-500"
            />
          </div>
          <Button type="submit" disabled={loading} className="bg-[#1B4332] hover:bg-[#143326] text-white rounded-xl px-6">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search size={18} />}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-bold tracking-widest uppercase text-xs">Calibrating Satellite Data...</p>
        </div>
      ) : weather && (
        <>
          {/* Main Hero Weather Card */}
          <Card className="bg-[#1B4332] text-white border-0 shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CloudSun size={200} />
            </div>
            
            <div className="p-8 md:p-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-none px-3 py-1">Current Conditions</Badge>
                  <h2 className="text-xl font-medium text-emerald-100/80 flex items-center gap-2">
                    {weather.location}
                  </h2>
                  <div className="flex items-center gap-6">
                    <span className="text-7xl md:text-8xl font-black tracking-tighter">
                      {weather.current?.temperature}°
                    </span>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold capitalize">{weather.current?.condition}</p>
                      <p className="text-emerald-100/60 font-medium">Feels like {weather.current?.feels_like}°C</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Humidity", val: `${weather.current?.humidity}%`, icon: Droplets, color: "text-blue-300" },
                    { label: "Wind Speed", val: `${weather.current?.wind_speed} km/h`, icon: Wind, color: "text-emerald-300" },
                    { label: "UV Index", val: weather.current?.uv_index || "Low", icon: Sun, color: "text-amber-300" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center text-center">
                      <item.icon className={cn("mb-2", item.color)} size={20} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100/50 mb-1">{item.label}</span>
                      <span className="text-lg font-black">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 7-Day Forecast Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weather.forecast?.map((day, i) => (
              <Card key={i} className="bg-white border-stone-100 shadow-sm hover:shadow-md transition-all text-center p-5 rounded-2xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter mb-3">{day.day}</p>
                <div className="flex justify-center mb-3 scale-110">{getConditionIcon(day.condition)}</div>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-lg font-black text-stone-900">{day.high}°</span>
                  <span className="text-xs font-bold text-stone-300">{day.low}°</span>
                </div>
                {day.rain_chance > 0 && (
                  <div className="mt-3 py-1 px-2 bg-blue-50 rounded-full inline-flex items-center gap-1">
                    <Droplets size={10} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600">{day.rain_chance}%</span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* AI Advisor Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-3 bg-stone-50 border-stone-200 rounded-3xl overflow-hidden shadow-none">
              <CardHeader className="bg-stone-100/50 border-b border-stone-200">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-stone-800">
                  <Thermometer className="text-emerald-600" size={20} />
                  Agronomic Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {farmTips.length > 0 ? farmTips.map((tip, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                      <h4 className="font-bold text-stone-900 leading-tight">{tip.title}</h4>
                      <p className="text-sm text-stone-500 leading-relaxed font-medium italic">"{tip.description}"</p>
                    </div>
                  )) : (
                    <p className="text-stone-400 text-sm">No specific farming tips available for this climate currently.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}