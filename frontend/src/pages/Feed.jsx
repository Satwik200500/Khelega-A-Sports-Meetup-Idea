import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, joinPost, leavePost } from "../api/posts";
import { sportIcons } from "../utils/sportIcons";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [sportFilter, setSportFilter] = useState("All");

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

  useEffect(() => {
    loadPosts();
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

  const sports = ["All", "Football", "Cricket", "Badminton", "Basketball", "Volleyball", "Tennis", "Other"];

  const visiblePosts =
    sportFilter === "All" ? posts : posts.filter((post) => post.sport === sportFilter);

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

      {actionError && <p className="form-error">{actionError}</p>}

      {visiblePosts.length === 0 && (
        <p className="feed-status">
          {posts.length === 0
            ? "No posts yet. Be the first to create one!"
            : `No ${sportFilter} games right now. Try a different sport.`}
        </p>
      )}

      <div className="post-grid">
        {visiblePosts.map((post) => {
          const hasJoined = currentUser && post.playersJoined.includes(currentUser.id);
          const spotsLeft = post.playersNeeded - post.playersJoined.length;

          return (
            <div className="post-card" key={post._id} >
              <Link to={`/posts/${post._id}`} className="post-card-link">
                <div className="post-card-header">
                  <span className="post-sport-tag">
                    <span className="post-sport-icon">{sportIcons[post.sport]}</span>
                    {post.sport}
                  </span>
                  <span className={`post-status post-status-${post.status}`}>{post.status}</span>
                </div>

                <div className="post-card-body">
                  <p className="post-location">📍 {post.location}</p>
                  <p className="post-time">🕒 {new Date(post.dateTime).toLocaleString()}</p>
                  <p className="post-equipment">
                    {post.hasEquipment ? "🏸 Equipment provided" : "🎒 Bring your own equipment"}
                  </p>

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

                {currentUser && hasJoined && (
                  <button className="btn-outline" onClick={() => handleLeave(post._id)}>Leave</button>
                )}

                {currentUser && !hasJoined && post.status === "open" && (
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