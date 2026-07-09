import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, joinPost, leavePost } from "../api/posts";
import { sportIcons } from "../utils/sportIcons";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { defaultIcon } from "../utils/leafletIconFix";
import { calculateDistance } from "../utils/distance";
import { searchLocation } from "../api/geocode";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [manualQuery, setManualQuery] = useState("");
  const [manualSuggestions, setManualSuggestions] = useState([]);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const manualDebounceRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      }
    );
  };

  useEffect(() => {
    loadPosts();
    requestLocation();
  }, []);

  const handleJoin = async (postId) => {
    setActionError("");
    try {
      await joinPost(postId);
      loadPosts();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleLeave = async (postId) => {
    setActionError("");
    try {
      await leavePost(postId);
      loadPosts();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleManualSearch = (value) => {
    setManualQuery(value);

    if (manualDebounceRef.current) clearTimeout(manualDebounceRef.current);

    manualDebounceRef.current = setTimeout(async () => {
      const results = await searchLocation(value);
      setManualSuggestions(results);
    }, 500);
  };

  const handleSelectManualLocation = (place) => {
    setUserLocation({ latitude: place.latitude, longitude: place.longitude });
    setLocationStatus("granted");
    setManualQuery(place.displayName);
    setManualSuggestions([]);
    setShowManualSearch(false);
  };

  const sports = ["All", "Football", "Cricket", "Badminton", "Basketball", "Volleyball", "Tennis", "Other"];

  const visiblePosts =
    sportFilter === "All" ? posts : posts.filter((post) => post.sport === sportFilter);

  const sortedPosts = useMemo(() => {
    if (!userLocation) return visiblePosts;

    return [...visiblePosts].sort((a, b) => {
      if (!a.latitude || !a.longitude) return 1;
      if (!b.latitude || !b.longitude) return -1;

      const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
      const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);

      return distA - distB;
    });
  }, [visiblePosts, userLocation]);

  if (loading) {
    return (
      <div className="feed-page">
        <h2>Games Near You</h2>
        <div className="post-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="skeleton-card" key={n}>
              <div className="skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p className="feed-status form-error">{error}</p>;

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h2>Games Near You</h2>

        <select
          className="sport-filter"
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
        >
          {sports.map((sport) => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
      </div>

      <div className="location-banner">
        {locationStatus === "granted" && !showManualSearch && (
          <p className="location-status">
            📍 Showing nearest games first —{" "}
            <button className="link-button" onClick={() => setShowManualSearch(true)}>change location</button>
          </p>
        )}

        {(locationStatus === "denied" || locationStatus === "unsupported") && !showManualSearch && (
          <p className="location-status">
            Location access not available —{" "}
            <button className="link-button" onClick={() => setShowManualSearch(true)}>search an area instead</button>
          </p>
        )}

        {showManualSearch && (
          <div className="location-input-wrapper">
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => handleManualSearch(e.target.value)}
              placeholder="Search for an area..."
              autoComplete="off"
            />
            {manualSuggestions.length > 0 && (
              <ul className="location-suggestions">
                {manualSuggestions.map((place, i) => (
                  <li key={i} onClick={() => handleSelectManualLocation(place)}>
                    {place.displayName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {actionError && <p className="form-error">{actionError}</p>}

      {sortedPosts.length === 0 && (
        <p className="feed-status">
          {posts.length === 0
            ? "No posts yet. Be the first to create one!"
            : `No ${sportFilter} games right now. Try a different sport.`}
        </p>
      )}

      <div className="post-grid">
        {sortedPosts.map((post) => {
          const hasJoined = currentUser && post.playersJoined.includes(currentUser.id);
          const isCreator = currentUser && post.createdBy?._id === currentUser.id;
          const spotsLeft = post.playersNeeded - post.playersJoined.length;

          const distance =
            userLocation && post.latitude && post.longitude
              ? calculateDistance(userLocation.latitude, userLocation.longitude, post.latitude, post.longitude)
              : null;

          return (
            <div className="post-card" key={post._id}>
              <Link to={`/posts/${post._id}`} className="post-card-link">
                <div className="post-card-header">
                  <span className="post-sport-tag">
                    <span className="post-sport-icon">{sportIcons[post.sport]}</span>
                    {post.sport === "Other" && post.otherSportName ? post.otherSportName : post.sport}
                  </span>
                  <span className={`post-status post-status-${post.status}`}>{post.status}</span>
                </div>

                <div className="post-card-body">
                  <p className="post-location">📍 {post.location}</p>
                  {distance !== null && (
                    <p className="post-distance">
                      {distance < 1 ? `${Math.round(distance * 1000)} m away` : `${distance.toFixed(1)} km away`}
                    </p>
                  )}
                  <p className="post-time">🕒 {new Date(post.dateTime).toLocaleString()}</p>
                  <p className="post-equipment">
                    {post.hasEquipment ? "🏸 Equipment provided" : "🎒 Bring your own equipment"}
                  </p>

                  {post.latitude && post.longitude && (
                    <div className="post-card-map" key={`map-wrapper-${post._id}`}>
                      <MapContainer
                        key={`map-${post._id}`}
                        center={[post.latitude, post.longitude]}
                        zoom={13}
                        zoomControl={false}
                        dragging={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        attributionControl={false}
                        style={{ height: "100px", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[post.latitude, post.longitude]} icon={defaultIcon} />
                      </MapContainer>
                    </div>
                  )}

                  <div className="post-progress">
                    <div className="post-progress-bar">
                      <div
                        className="post-progress-fill"
                        style={{ width: `${(post.playersJoined.length / post.playersNeeded) * 100}%` }}
                      ></div>
                    </div>
                    <span className="post-progress-label">
                      {post.playersJoined.length}/{post.playersNeeded} joined
                    </span>
                  </div>
                </div>
              </Link>

              <div className="post-card-divider"></div>

              <div className="post-card-footer">
                <div className="post-creator-row">
                  <span className="post-creator-avatar">
                    {post.createdBy?.name?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="post-spots">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</p>
                    <p className="post-creator">by {post.createdBy?.name}</p>
                  </div>
                </div>

                {currentUser && !isCreator && hasJoined && (
                  <button className="btn-outline" onClick={() => handleLeave(post._id)}>Leave</button>
                )}

                {currentUser && !isCreator && !hasJoined && post.status === "open" && (
                  <button className="btn-accent" onClick={() => handleJoin(post._id)}>Join</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Feed;