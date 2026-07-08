import { useState, useEffect } from "react";
import { getAllPosts, joinPost, leavePost } from "../api/posts";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

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

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Games</h2>

      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      {posts.length === 0 && <p>No posts yet. Be the first to create one!</p>}

      {posts.map((post) => {
        const hasJoined = currentUser && post.playersJoined.includes(currentUser.id);

        return (
          <div key={post._id} style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
            <h3>{post.sport}</h3>
            <p>Location: {post.location}</p>
            <p>Time: {new Date(post.dateTime).toLocaleString()}</p>
            <p>Players needed: {post.playersNeeded}</p>
            <p>Players joined: {post.playersJoined.length}</p>
            <p>Equipment provided: {post.hasEquipment ? "Yes" : "No"}</p>
            <p>Posted by: {post.createdBy?.name}</p>
            <p>Status: {post.status}</p>

            {currentUser && hasJoined && (
              <button onClick={() => handleLeave(post._id)}>Leave</button>
            )}

            {currentUser && !hasJoined && post.status === "open" && (
              <button onClick={() => handleJoin(post._id)}>Join</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Feed;