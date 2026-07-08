import { useState, useEffect } from "react";
import { getAllPosts } from "../api/posts";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Games</h2>

      {posts.length === 0 && <p>No posts yet. Be the first to create one!</p>}

      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
          <h3>{post.sport}</h3>
          <p>Location: {post.location}</p>
          <p>Time: {new Date(post.dateTime).toLocaleString()}</p>
          <p>Players needed: {post.playersNeeded}</p>
          <p>Players joined: {post.playersJoined.length}</p>
          <p>Equipment provided: {post.hasEquipment ? "Yes" : "No"}</p>
          <p>Posted by: {post.createdBy?.name}</p>
          <p>Status: {post.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Feed;