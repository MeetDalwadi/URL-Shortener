const sessionIdToMap = new Map();

const setUser = (id, user) => {
  sessionIdToMap.set(id, user);
};

const getUser = (id) => {
  return sessionIdToMap.get(id);
};

const removeUser = (id) => {
  return sessionIdToMap.delete(id);
};

module.exports = {
  setUser,
  getUser,
  removeUser,
};
