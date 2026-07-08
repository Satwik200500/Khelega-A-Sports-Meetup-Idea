import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";

function CreatePost() {
  const [sport, setSport] = useState("Football");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [playersNeeded, setPlayersNeeded] = useState(1);
  const [hasEquipment, setHasEquipment] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createPost({
        sport,
        location,
        dateTime,
        playersNeeded: Number(playersNeeded),
        hasEquipment,
      });
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create a Post</h2>

      <form onSubmit={handleSubmit}>
        <div>
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
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Players Needed</label>
          <input
            type="number"
            min="1"
            value={playersNeeded}
            onChange={(e) => setPlayersNeeded(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={hasEquipment}
              onChange={(e) => setHasEquipment(e.target.checked)}
            />
            I have equipment
          </label>
        </div>

        <button type="submit">Create Post</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CreatePost;