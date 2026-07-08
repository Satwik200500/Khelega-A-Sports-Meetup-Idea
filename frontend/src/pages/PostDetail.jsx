import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, joinPost, leavePost, deletePost } from "../api/posts";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadPost = async () => {
    try {
      const data = await getPostById(id);
      setPost(data.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleJoin = async () => {
    setActionError("");
    try {
      await joinPost(id);
      loadPost();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleLeave = async () => {
    setActionError("");
    try {
      await leavePost(id);
      loadPost();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    try {
      await deletePost(id);
      navigate("/feed");
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <p className="feed-status">Loading post...</p>;
  if (error) return <p className="feed-status form-error">{error}</p>;

  const hasJoined = currentUser && post.playersJoined.some((p) => p._id === currentUser.id);
  const isCreator = currentUser && post.createdBy?._id === currentUser.id;
  const spotsLeft = post.playersNeeded - post.playersJoined.length;

  return (
    <div className="detail-page">
      <div className="detail-card">
        <div className="post-card-header">
          <span className="post-sport-tag">{post.sport}</span>
          <span className={`post-status post-status-${post.status}`}>{post.status}</span>
        </div>

        <div className="detail-body">
          <p>📍 {post.location}</p>
          <p>🕒 {new Date(post.dateTime).toLocaleString()}</p>
          <p>{post.hasEquipment ? "🏸 Equipment provided" : "🎒 Bring your own equipment"}</p>
          <p>{spotsLeft} of {post.playersNeeded} spots left</p>
          <p className="post-creator">Organized by {post.createdBy?.name}</p>
        </div>

        <div className="post-card-divider"></div>

        <div className="detail-body">
          <h3 className="my-posts-subheading">Players Joined ({post.playersJoined.length})</h3>
          {post.playersJoined.length === 0 && <p className="post-creator">No one has joined yet.</p>}
          <ul className="players-list">
            {post.playersJoined.map((player) => (
              <li key={player._id}>{player.name}</li>
            ))}
          </ul>
        </div>

        {actionError && <p className="form-error">{actionError}</p>}

        <div className="detail-actions">
          {currentUser && !isCreator && hasJoined && (
            <button className="btn-outline" onClick={handleLeave}>Leave</button>
          )}
          {currentUser && !isCreator && !hasJoined && post.status === "open" && (
            <button className="btn-accent" onClick={handleJoin}>Join</button>
          )}
          {isCreator && (
            <button className="btn-outline" onClick={handleDelete}>Delete Post</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;