import { useState, useEffect } from "react";
import { getMyPosts, leavePost } from "../api/posts";
import { Link } from "react-router-dom";
import { sportIcons } from "../utils/sportIcons";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { defaultIcon } from "../utils/leafletIconFix";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLeave = async (postId) => {
    try {
      await leavePost(postId);
      loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

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

  const createdPosts = posts.filter((post) => post.createdBy?._id === currentUser.id);
  const joinedPosts = posts.filter(
    (post) =>
      post.playersJoined.includes(currentUser.id) &&
      post.createdBy?._id !== currentUser.id
  );

  return (
    <div className="feed-page">
      <h2>My Posts</h2>

      <h3 className="my-posts-subheading">Games You Created</h3>
      {createdPosts.length === 0 && (
        <p className="feed-status">
          You haven't created any posts yet. <Link to="/create-post">Create one</Link>.
        </p>
      )}
      <div className="post-grid">
        {createdPosts.map((post) => {
          const spotsLeft = post.playersNeeded - post.playersJoined.length;
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
                  <p className="post-time">🕒 {new Date(post.dateTime).toLocaleString()}</p>

                  {post.latitude && post.longitude && (
                    <div className="post-card-map">
                      <MapContainer
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
                      {post.playersJoined.length}/{post.playersNeeded} joined · {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <h3 className="my-posts-subheading">Games You Joined</h3>
      {joinedPosts.length === 0 && (
        <p className="feed-status">
          You haven't joined any posts yet. <Link to="/feed">Browse games</Link>.
        </p>
      )}
      <div className="post-grid">
        {joinedPosts.map((post) => (
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
                <p className="post-time">🕒 {new Date(post.dateTime).toLocaleString()}</p>

                {post.latitude && post.longitude && (
                  <div className="post-card-map">
                    <MapContainer
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
              </div>
            </Link>

            <div className="post-card-divider"></div>

            <div className="post-card-footer">
              <div className="post-creator-row">
                <span className="post-creator-avatar">
                  {post.createdBy?.name?.charAt(0).toUpperCase()}
                </span>
                <p className="post-creator">Organized by {post.createdBy?.name}</p>
              </div>
              <button className="btn-outline" onClick={() => handleLeave(post._id)}>Leave</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;