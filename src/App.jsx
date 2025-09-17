import { useEffect, useState } from "react";
import DetailCard from "./components/detailCard";
import DailyForecastCard from "./components/dailyForecastCard";
import "./index.css";
import UnitsDropdown from "./components/unitsDropdown";
import DaysDropdown from "./components/daysDropdown";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("Berlin");
  const [country, setCountry] = useState("Germany");
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [units, setUnits] = useState({
    temperature: "celsius",
    windSpeed: "km/h",
    precipitation: "mm",
  });
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      try {
        const defaultCity = "Berlin";
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${defaultCity}`
        );
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          setNoResults(true);
          setWeather(null);
          return;
        }

        const { latitude, longitude } = geoData.results[0];

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=apparent_temperature,temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultWeather();
  }, []);
  const handleSearch = async () => {
    if (!city) return;

    setLoading(true);
    setNoResults(false);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setNoResults(true);
        setWeather(null);
        setSearchedCity("");
        setLoading(false);
        return;
      }

      const { latitude, longitude, country } = geoData.results[0];
      setSearchedCity(city);
      setCountry(country);

      setCity("");
      setNoResults(false);
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=apparent_temperature,temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);
    } catch (err) {
      console.error(err);
      setWeather(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code) => {
    const codeMap = {
      0: "icon-sunny.webp", // Clear sky
      1: "icon-sunny.webp", // Mainly clear
      2: "icon-partly-cloudy.webp", // Partly cloudy
      3: "icon-overcast.webp", // Overcast
      45: "icon-fog.webp", // Fog
      48: "icon-fog.webp", // Depositing rime fog
      51: "icon-drizzle.webp", // Drizzle: Light
      53: "icon-drizzle.webp", // Drizzle: Moderate
      55: "icon-drizzle.webp", // Drizzle: Dense intensity
      56: "icon-drizzle.webp", // Freezing Drizzle: Light
      57: "icon-drizzle.webp", // Freezing Drizzle: Dense intensity
      61: "icon-rain.webp", // Rain: Slight
      63: "icon-rain.webp", // Rain: Moderate
      65: "icon-rain.webp", // Rain: Heavy intensity
      66: "icon-rain.webp", // Freezing Rain: Light
      67: "icon-rain.webp", // Freezing Rain: Heavy intensity
      71: "icon-snow.webp", // Snow fall: Slight
      73: "icon-snow.webp", // Snow fall: Moderate
      75: "icon-snow.webp", // Snow fall: Heavy intensity
      77: "icon-snow.webp", // Snow grains
      80: "icon-rain.webp", // Rain showers: Slight
      81: "icon-rain.webp", // Rain showers: Moderate
      82: "icon-rain.webp", // Rain showers: Violent
      85: "icon-snow.webp", // Snow showers slight
      86: "icon-snow.webp", // Snow showers heavy
      95: "icon-storm.webp", // Thunderstorm: Slight or moderate
      96: "icon-storm.webp", // Thunderstorm with slight hail
      99: "icon-storm.webp", // Thunderstorm with heavy hail
    };
    return codeMap[Number(code)];
  };

  const convertTemperature = (temp) => {
    return units.temperature === "celsius" ? temp : (temp * 9) / 5 + 32;
  };

  const convertWind = (speed) => {
    return units.windSpeed === "km/h" ? speed : speed / 1.609;
  };

  const convertPrecipitation = (prec) => {
    return units.precipitation === "mm" ? prec : prec / 25.4;
  };

  const dayOptions =
    weather?.daily?.time?.map((dateString) =>
      new Date(dateString).toLocaleDateString("en-US", { weekday: "long" })
    ) ?? [];

  const hourlyDataForSelectedDay =
    weather && selectedDay
      ? weather.hourly.time
          .map((time, i) => ({
            time,
            temp: weather.hourly.temperature_2m[i],
            code: weather.hourly.weather_code[i],
            day: new Date(time).toLocaleDateString("en-US", {
              weekday: "long",
            }),
          }))
          .filter((hour) => hour.day === selectedDay)
      : [];

  useEffect(() => {
    if (weather?.daily?.time?.length && !selectedDay) {
      const firstDay = new Date(weather.daily.time[0]).toLocaleDateString(
        "en-US",
        { weekday: "long" }
      );
      setSelectedDay(firstDay);
    }
  }, [weather, selectedDay]);

  const handleRetry = () => {
    setError(false);
    setNoResults(false);
    handleSearch();
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="logo.svg" alt="Weather App Logo" className="logo" />
        <UnitsDropdown
          className="units-btn"
          units={units}
          setUnits={setUnits}
        />
      </div>
      <div className="under-header">
        {!error && (
          <>
            <h2 className="title">How's the sky looking today?</h2>
            <div className="search-bar">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search for a place..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </>
        )}
        {weather ? (
          <div className="under-header">
            <div className="main-content">
              <div className="left-section">
                {/* Weather Card */}

                <div className="weather-card">
                  <div className="weather-main-row">
                    <div className="city-date-info">
                      <div className="city">
                        {searchedCity}, {country}
                      </div>
                      <div className="date">
                        {new Date(weather.current.time).toLocaleDateString(
                          "en-US",
                          undefined,
                          { weekday: "long", month: "short", day: "numeric" }
                        )}
                      </div>
                    </div>
                    <div className="temp">
                      <span className="icon">
                        <img
                          src={getWeatherIcon(weather.current.weather_code)}
                          alt="Weather icon"
                          style={{ verticalAlign: "middle" }}
                        />
                      </span>
                      {weather.current.temperature_2m}°
                    </div>
                  </div>
                </div>

                {/* Current Stats Row */}

                <div className="stats-row">
                  <DetailCard
                    title="Feels Like"
                    description={`${Math.round(
                      convertTemperature(weather.current.apparent_temperature)
                    )}°`}
                  />

                  <DetailCard
                    title="Humidity"
                    description={`${weather.current.relative_humidity_2m}%`}
                  />

                  <DetailCard
                    title="Wind"
                    description={`${Math.round(
                      convertWind(weather.current.wind_speed_10m)
                    )} ${units.windSpeed}`}
                  />

                  <DetailCard
                    title="Precipitation"
                    description={`${Math.round(
                      convertPrecipitation(weather.current.precipitation)
                    )} ${units.precipitation}`}
                  />
                </div>

                {/* Daily Forecast */}

                <div className="daily-forecast">
                  <div className="daily-forecast-title">Daily Forecast</div>
                  <div className="daily-forecast-row">
                    {weather.daily.time.slice(0, 7).map((time, i) => (
                      <DailyForecastCard
                        time={time}
                        tempMax={weather.daily.temperature_2m_max[i]}
                        tempMin={weather.daily.temperature_2m_min[i]}
                        weatherCode={weather.daily.weather_code[i]}
                        getWeatherIcon={getWeatherIcon}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="right-section">
                {/* Hourly Forecast */}

                <div className="hourly-forecast">
                  <div className="hourly-header">
                    <span className="hourly-title">Hourly Forecast</span>
                    <DaysDropdown
                      availableDays={dayOptions}
                      selectedDay={selectedDay}
                      setSelectedDay={setSelectedDay}
                    />
                  </div>
                  <div className="hourly-list">
                    <ul className="hourly-list">
                      {hourlyDataForSelectedDay.length
                        ? hourlyDataForSelectedDay.map((hour) => (
                            <li className="hourly-item" key={hour.time}>
                              <img
                                src={getWeatherIcon(hour.code)}
                                alt="Weather icon"
                              />
                              <span className="hourly-time">
                                {new Date(hour.time).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </span>
                              <span className="hourly-temp">{hour.temp}°</span>
                            </li>
                          ))
                        : "Loading hourly data..."}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div>
            <div className="main-content">
              <div className="left-section">
                <div className="empty-weather-card">
                  <p className="loading">Loading...</p>
                </div>
                <div className="stats-row">
                  <div className="empty-stat-box">
                    <div className="stat-label">Feels Like</div>
                    <div className="stat-value">-</div>
                  </div>
                  <div className="empty-stat-box">
                    <div className="stat-label">Humidity</div>
                    <div className="stat-value">-</div>
                  </div>
                  <div className="empty-stat-box">
                    <div className="stat-label">Wind</div>
                    <div className="stat-value">-</div>
                  </div>
                  <div className="empty-stat-box">
                    <div className="stat-label">Precipitation</div>
                    <div className="stat-value">-</div>
                  </div>
                </div>
                <div className="daily-forecast">
                  <div className="daily-forecast-title">Daily Forecast</div>
                  <div className="daily-forecast-row">
                    <div className="empty-daily-box"></div>
                    <div className="empty-daily-box"></div>
                    <div className="empty-daily-box"></div>
                    <div className="empty-daily-box"></div>
                    <div className="empty-daily-box"></div>
                    <div className="empty-daily-box"></div>
                    <div className="empty-daily-box"></div>
                  </div>
                </div>
              </div>
              <div className="right-section">
                <div className="hourly-forecast">
                  <div className="hourly-header">
                    <span className="hourly-title">Hourly Forecast</span>
                    <span className="hourly-title">-</span>
                  </div>
                  <div className="hourly-list">
                    <ul className="hourly-list">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <li className="hourly-item" key={i}>
                          <div className="hourly-item"></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : noResults ? (
          <p className="no-result">No search result found!</p>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">
              <img src="icon-error.svg" alt="Error" />
            </div>
            <p className="error-message">Something went wrong</p>
            <p className="api-error">
              We couldn't connect to the server (API error). Please try again in
              a few moments.
            </p>
            <button className="retry-btn" onClick={handleRetry}>
              <img className="retry-icon" src="icon-retry.svg" /> Retry
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
