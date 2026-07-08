import { useState, useEffect } from "react";
import { getAllPosts, leavePost } from "../api/posts";
import { Link } from "react-router-dom";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleLeave = async (postId) => {
    try {
      await leavePost(postId);
      loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="feed-status">Loading your posts...</p>;
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
        {createdPosts.map((post) => (
          <div className="post-card" key={post._id}>
            <div className="post-card-header">
              <span className="post-sport-tag">{post.sport}</span>
              <span className={`post-status post-status-${post.status}`}>{post.status}</span>
            </div>
            <div className="post-card-body">
              <p className="post-location">📍 {post.location}</p>
              <p className="post-time">🕒 {new Date(post.dateTime).toLocaleString()}</p>
              <p className="post-spots">
                {post.playersJoined.length}/{post.playersNeeded} players joined
              </p>
            </div>
          </div>
        ))}
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
            <div className="post-card-header">
              <span className="post-sport-tag">{post.sport}</span>
              <span className={`post-status post-status-${post.status}`}>{post.status}</span>
            </div>
            <div className="post-card-body">
              <p className="post-location">📍 {post.location}</p>
              <p className="post-time">🕒 {new Date(post.dateTime).toLocaleString()}</p>
              <p className="post-creator">Organized by {post.createdBy?.name}</p>
            </div>
            <div className="post-card-divider"></div>
            <div className="post-card-footer">
              <span></span>
              <button className="btn-outline" onClick={() => handleLeave(post._id)}>Leave</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;