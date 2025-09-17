function DetailCard({ title, description }) {
  return (
    <div className="stat-box">
      <div className="stat-label">{title}</div>
      <div className="stat-value">{description}</div>
    </div>
  );
}

export default DetailCard;
