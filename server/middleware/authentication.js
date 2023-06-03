const db = require('../db/db.js');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: missing token" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: invalid token" });
  }
  checkToken(token).then(result => {
    if(result && result !== "error") {
      req.userId = result.username
      next()
    } else if(result === "error"){
      return res.status(401).json({ error: "Unauthorized: invalid token" });
    }
  })
};

async function checkToken(token) {
  const name = token.split("-");
  const user = await db.users.find(u => u.username === name[0])
  if (user) {
    return user;
  } else {
    return "error";
  }
}

module.exports = {authMiddleware};
