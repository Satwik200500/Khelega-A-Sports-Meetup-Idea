export const searchLocation = async (query) => {
  if (!query || query.trim().length < 3) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.map((place) => ({
    displayName: place.display_name,
    latitude: parseFloat(place.lat),
    longitude: parseFloat(place.lon),
  }));
};