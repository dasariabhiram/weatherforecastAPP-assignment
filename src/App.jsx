import React, { useEffect, useState } from "react";
import Temperature from "./componenets/Temperature";
import Highlights from "./componenets/Highlights";

function App() {
  const [city, setCity] = useState("New Delhi");
  const [weatherData, setWeatherData] = useState(null);
  const [debouncedCity, setDebouncedCity] = useState(city);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedCity(city);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [city]);

  useEffect(() => {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=0eb2f9e6dd554873aa7120429230511&q=${debouncedCity}&aqi=no;`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not get data");
        }
        return res.json();
      })
      .then((data) => {
        setWeatherData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [debouncedCity]);

  return (
    <div className="bg-sky-950  h-screen flex flex-col items-center justify-center">
    <div className="mb-4">
      {weatherData && (
        <Temperature
          setCity={setCity}
          stats={{
            temp: weatherData.current.temp_c,
            condition: weatherData.current.condition.text,
            isDay: weatherData.current.is_day,
            location: weatherData.location.name,
            time: weatherData.location.localtime,
          }}
        />
      )}
    </div>
    <div className="grid grid-cols-2 gap-6">
      <h1 className="text-slate-200 text-2xl col-span-2 mb-4">
        Today's Highlights
      </h1>
        {weatherData && (
          <>
            <Highlights
              stats={{
                title: "Wind Status",
                value: weatherData.current.wind_mph,
                unit: "mph",
                direction: weatherData.current.wind_dir,
              }}
            />
            <Highlights
              stats={{
                title: "Humidity",
                value: weatherData.current.humidity,
                unit: "%",
              }}
            />
            <Highlights
              stats={{
                title: "Visibility",
                value: weatherData.current.vis_miles,
                unit: "miles",
              }}
            />
            <Highlights
              stats={{
                title: "Air Pressure",
                value: weatherData.current.pressure_mb,
                unit: "mb",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
