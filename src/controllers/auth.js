const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { prisma } = require('../config/db');

const login = async (req, res) => {
  try {

    console.log("LOGIN content-type:", req.headers["content-type"]);
    console.log("LOGIN body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required fields.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credentials are invalid.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // changed to passwordHash to match the database field

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credentials are invalid.' });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

    res.json({
      message: 'Login is successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error has occurred.' });
  }
  
};

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are all required fields.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    //to hash before save to database
    const saltRounds = 15;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword, // changed to passwordHash to match the database field
        firstName,
        lastName,
        role: role || 'STUDENT',
      },
    });

    res.status(201).json({
      message: 'User has been registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

module.exports = { login, register };
