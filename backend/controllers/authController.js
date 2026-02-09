const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* REGISTER */
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role",
      [name, email, hashed, role || "customer"]
    );

    const user = result.rows[0];

    // No separate artist_profiles auto-creation when using merged users artist fields

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ message: "User not found" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role }
  });
};

/* GOOGLE AUTH */
exports.googleAuth = async (req, res) => {
  const { name, email } = req.body;

  const check = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  let user;

  if (check.rows.length === 0) {
    const created = await pool.query(
      "INSERT INTO users(name,email,provider,is_verified) VALUES($1,$2,'google',true) RETURNING *",
      [name, email]
    );
    user = created.rows[0];
  } else {
    user = check.rows[0];
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role }
  });
};
