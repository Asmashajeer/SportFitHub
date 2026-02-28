const GetMapsLink = (coords: [number, number]) => {
  // MongoDB uses [lng, lat], Google uses lat,lng
  const [lng, lat] = coords;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

export default GetMapsLink;