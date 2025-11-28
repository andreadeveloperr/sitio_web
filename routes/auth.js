// routes/auth.js
// Endpoints para registro y login

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'users.json');

// Leer usuarios desde el archivo
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; 
  }
}

// Guardar usuarios en el archivo
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validar campos
  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son obligatorios' });
  }

  const users = await readUsers();

  // Verificar si el usuario ya existe
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  // Encriptar la contraseña
  const hashed = bcrypt.hashSync(password, 10);

  const newUser = {
    id: uuidv4(),
    username,
    password: hashed
  };

  users.push(newUser);
  await writeUsers(users);

  res.json({ mensaje: 'Registro exitoso' });
});

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ mensaje: 'Error en la autenticación' });
  }

  // Comparar contraseñas
  const match = bcrypt.compareSync(password, user.password);

  if (!match) {
    return res.status(401).json({ mensaje: 'Error en la autenticación' });
  }

  res.json({ mensaje: 'Autenticación satisfactoria' });
});

module.exports = router;