import { useRef, useState } from "react";

const Api_key = "a90531c00c9a34222f7798834adf9fbe";

const App = () => {
  
  const inputRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WeatherTypes = [
    { type: "Clear", img: "./contrast.png" },
    { type: "Rain", img: "./heavy-rain.png" },
    { type: "Snow", img: "./snowflake (1).png" },
    { type: "Clouds", img: "./clouds.png" },
    { type: "Haze", img: "./clouds.png" },
    { type: "Drizzle", img: "./drizzle.png" },
  ];

  const fetchWeather = async () => {

    const location = inputRef.current.value.trim();
    
    if (!location) {
      setError("Please enter a location.");
      setApiData(null);
      setShowWeather(null);
      return;

    }

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${Api_key}`;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(URL);
      const data = await response.json();
      
      if (data.cod === 404 || data.cod === 400) {
        setShowWeather([{ type: "Not Found", img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png" }]);
        setApiData(null);
      } else {
        setShowWeather(WeatherTypes.filter(weather => weather.type === data.weather[0].main));
        setApiData(data);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data. Please try again.");
      setShowWeather(null);
      setApiData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid place-items-center h-full">
          <img src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png" className="w-14 mx-auto mb-2 animate-spin" />
        </div>
      );
    }

    if (showWeather) {

      return (

        <div className="text-center flex flex-col gap-6 mt-10">
          {apiData && (
            <p className="text-xl font-semibold">
              {apiData?.name}, {apiData?.sys?.country}
            </p>
          )}

          <img src={showWeather[0]?.img} alt={showWeather[0]?.type} className="w-52 mx-auto" />
          <h3 className="text-2xl font-bold text-zinc-800">{showWeather[0]?.type}</h3>

          {apiData && (
            <div className="flex justify-center">
              <img src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png" alt="Temperature" className="h-9 mt-1" />
              <h2 className="text-4xl font-extrabold">{apiData?.main?.temp}&#176;C</h2>
            </div>
          )}

        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white grid place-items-center m-4 sm:m-8 lg:m-12 font-mono">

      <h1 className="text-3xl sm:text-4xl border-2 p-4 rounded-md">WEATHER</h1>

      <div className="bg-white w-full sm:w-96 p-4 rounded-md shadow-lg mt-8 sm:mt-12">

        <div className="flex items-center justify-between">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter Your Location"
            className="text-lg sm:text-xl border-b p-1 border-gray-200 font-semibold flex-1 focus:outline-none"
          />

          <button onClick={fetchWeather}>
            <img src="./loupe.png" alt="Search" className="w-6 sm:w-8 m-2" />
          </button>
        </div>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        <div className={`duration-300 delay-75 overflow-hidden ${showWeather ? "h-[27rem]" : "h-0"}`}>
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default App;
