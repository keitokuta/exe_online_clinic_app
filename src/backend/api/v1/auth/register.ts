import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user-service';
import { User } from '../models/user';

const router = express.Router();
const userService = new UserService();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // バリデーション
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // パスワードハッシュ
    const hashedPassword = await bcrypt.hash(password, 10);

    // アカウント作成
    const user = new User(email, hashedPassword);
    const newUser = await userService.createUser(user);

    // JWT発行
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;