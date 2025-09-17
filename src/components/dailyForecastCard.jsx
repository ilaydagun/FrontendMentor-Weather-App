function DailyForecastCard({
  time,
  weatherCode,
  tempMax,
  tempMin,
  getWeatherIcon,
}) {
  return (
    <div className="daily-box" key={time}>
      <div className="day">
        {new Date(time).toLocaleDateString("en-US", { weekday: "short" })}
      </div>
      <img src={getWeatherIcon(weatherCode)} alt="Weather icon" />
      <div className="temp-range">
        <div className="max">{tempMax}°</div>
        <div className="min">{tempMin}°</div>
      </div>
    </div>
  );
}

export default DailyForecastCard;
