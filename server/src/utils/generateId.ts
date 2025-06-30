const generateId = (length: number = 6) => {
  const charset = "0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    id += charset[randomIndex];
  }

  return id;
};

export default generateId;
