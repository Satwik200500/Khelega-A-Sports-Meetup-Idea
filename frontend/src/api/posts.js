const BASE_URL = `${import.meta.env.VITE_API_URL}/api/posts`;

export const getAllPosts = async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};

export const createPost = async (postData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }

  return data;
};

export const joinPost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${postId}/join`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to join post");
  }

  return data;
};

export const leavePost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${postId}/leave`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to leave post");
  }

  return data;
};

export const getPostById = async (postId) => {
  const response = await fetch(`${BASE_URL}/${postId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data;
};

export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }

  return data;
};