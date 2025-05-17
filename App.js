import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

export default function App() {
  const [inputLocation, setInputLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Функция для получения данных о погоде через API
  const fetchWeather = async () => {
    if (!inputLocation.trim()) {
      setError("Пожалуйста, введите название города.");
      return;
    }

    const apiKey = "6c2f8091a2af44519de150451250505"; // Замените на свой ключ
    const url = `https://api.weatherapi.com/v1/current.json?key= ${apiKey}&q=${encodeURIComponent(inputLocation)}&aqi=no`;

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Город не найден");
      }

      const data = await response.json();

      // Проверяем, есть ли current и condition в ответе
      // if (!data["current"]["feelslike_c"] || !Array.isArray(data["current"]["feelslike_c"])) {
      //   throw new Error("Некорректные данные от сервера");
      // }

      setWeatherData(data);
    } catch (err) {
      setError(err.message || "Не удалось получить данные о погоде");
    } finally {
      setLoading(false);
    }
  };

  // Функция для подсказок по одежде на основе ощущаемой температуры
  const getOutfitSuggestion = (feelsLikeTemp) => {
    if (feelsLikeTemp < -10) {
      return "Утепленная куртка, шерстяные носки, термобелье, теплый свитер, шапка, шарф и перчатки.";
    } else if (feelsLikeTemp < 0) {
      return "Теплая куртка, шапка, шарф, водонепроницаемые ботинки и свитер.";
    } else if (feelsLikeTemp < 10) {
      return "Кофта, легкая куртка, джинсы и удобная обувь. Возьми зонт.";
    } else if (feelsLikeTemp < 20) {
      return "Футболка, свитшот, джинсы или юбка, кроссовки или туфли.";
    } else if (feelsLikeTemp < 30) {
      return "Легкая футболка или майка, шорты или юбка, сандалии, солнцезащитные очки.";
    } else {
      return "Шорты, майка, шляпа, солнцезащитные очки и много воды.";
    }
  };

  // Безопасный доступ к данным
  const locationName = weatherData?.location?.name || "Неизвестный город";
  const conditionText = weatherData?.current?.condition?.temp_c;
  const feelslikeC = weatherData?.current?.feelslike_c ?? "—";
  const iconUrl = weatherData?.current?.condition?.icon
    ? `https:${weatherData.current.condition.icon}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 transition-all duration-500">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h1 className="text-2xl font-bold mb-2">DressCast</h1>
          <form onSubmit={(e) => { e.preventDefault(); fetchWeather(); }} className="flex gap-2">
            <input
              type="text"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              placeholder="Введите город"
              className="flex-1 px-3 py-2 rounded-lg text-gray-800 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Поиск
            </button>
          </form>
        </div>

        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600">Загрузка погоды...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 text-center">{error}</div>
        ) : weatherData ? (
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{locationName}</h2>
                <p className="text-gray-600 capitalize">{conditionText}</p>
              </div>
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt={conditionText}
                  className="w-12 h-12"
                />
              )}
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold text-indigo-700">
                {feelslikeC}°C <span className="text-sm text-gray-500">(по ощущениям)</span>
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-800">Совет по стилю:</h3>
              <p className="mt-2 text-gray-700">
                {getOutfitSuggestion(feelslikeC)}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-gray-600 text-center">
            Введите город, чтобы получить прогноз.
          </div>
        )}
      </div>

      <div className="mt-8 max-w-md w-full bg-white rounded-2xl shadow-md p-4 text-sm text-gray-600"></div>
    </div>
  );
}