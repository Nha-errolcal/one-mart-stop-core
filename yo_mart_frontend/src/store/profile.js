export const removeAcccessToken = () => {
  localStorage.removeItem("token");
};

export const getAcccessToken = () => {
  return localStorage.getItem("token");
};

export const setAcccessToken = (token) => {
  localStorage.setItem("token", token);
};

export const setProfile = (value) => {
  localStorage.setItem("user", value);
};

export const getProfile = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    return null;
  }
};
