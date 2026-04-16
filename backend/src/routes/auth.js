const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const secret = process.env.JWT_SECRET || "change_this_secret";

const router = express.Router();

// register (students can self-register)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "Missing fields" });
  const existing = await db("users").where({ email }).first();
  if (existing)
    return res.status(400).json({ error: "Email already registered" });
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    password: hash,
    role: "student",
    created_at: new Date(),
  };
  await db("users").insert(user);
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "8h" },
  );
  res.json({ token });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  const user = await db("users").where({ email }).first();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "8h" },
  );
  res.json({ token, role: user.role, name: user.name });
});

module.exports = router;
