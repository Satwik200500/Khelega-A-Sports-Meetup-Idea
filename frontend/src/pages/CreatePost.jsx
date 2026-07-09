import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { searchLocation } from "../api/geocode";

function CreatePost() {
  const [sport, setSport] = useState("Football");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [playersNeeded, setPlayersNeeded] = useState(1);
  const [hasEquipment, setHasEquipment] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleLocationChange = (value) => {
    setLocation(value);
    setCoords(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const results = await searchLocation(value);
      setSuggestions(results);
      setShowSuggestions(true);
    }, 500);
  };

  const handleSelectSuggestion = (place) => {
    setLocation(place.displayName);
    setCoords({ latitude: place.latitude, longitude: place.longitude });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (new Date(dateTime) < new Date()) {
    setError("Please enter a valid future date and time");
    return;
  }

  try {
    await createPost({
      sport,
      location,
      dateTime,
      playersNeeded: Number(playersNeeded),
      hasEquipment,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });
    navigate("/feed");
  } catch (err) {
    setError(err.message);
  }
};
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create a Post</h2>
        <p className="auth-subtitle">Tell players what you need.</p>

        <label>Sport</label>
        <select value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Badminton">Badminton</option>
          <option value="Basketball">Basketball</option>
          <option value="Volleyball">Volleyball</option>
          <option value="Tennis">Tennis</option>
          <option value="Other">Other</option>
        </select>

        <label>Location</label>
        <div className="location-input-wrapper">
          <input
            type="text"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Start typing an address..."
            autoComplete="off"
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="location-suggestions">
              {suggestions.map((place, i) => (
                <li key={i} onClick={() => handleSelectSuggestion(place)}>
                  {place.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>
        {coords && <p className="location-confirmed">📍 Location pinned</p>}

        <label>Date & Time</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />

        <label>Players Needed</label>
        <input
          type="number"
          min="1"
          value={playersNeeded}
          onChange={(e) => setPlayersNeeded(e.target.value)}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={hasEquipment}
            onChange={(e) => setHasEquipment(e.target.checked)}
          />
          I have equipment to bring
        </label>

        <button className="btn-primary" type="submit">Create Post</button>

        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}

export default CreatePost;