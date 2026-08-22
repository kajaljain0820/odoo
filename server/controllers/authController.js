import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretglobaltrotterkey123!';

// Register user
export const register = async (req, res) => {
  try {
    const { username, password, first_name, last_name, email, phone, city, photo_url, additional_info } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email,
      phone,
      city,
      photo_url: photo_url || null,
      additional_info: additional_info || '',
      is_admin: username.toLowerCase() === 'admin' // Make user 'admin' an admin automatically
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser.id, username: newUser.username, is_admin: newUser.is_admin }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        photo_url: newUser.photo_url,
        additional_info: newUser.additional_info,
        is_admin: newUser.is_admin
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        photo_url: user.photo_url,
        additional_info: user.additional_info,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current logged in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      photo_url: user.photo_url,
      additional_info: user.additional_info,
      is_admin: user.is_admin
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, city, photo_url, additional_info } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If email is being changed, check if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update fields
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.city = city !== undefined ? city : user.city;
    user.photo_url = photo_url !== undefined ? photo_url : user.photo_url;
    user.additional_info = additional_info !== undefined ? additional_info : user.additional_info;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      photo_url: user.photo_url,
      additional_info: user.additional_info,
      is_admin: user.is_admin
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Delete own account
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
};
