import express from 'express';
import { BookingService } from '../services/booking-service';
import { Booking } from '../models/booking';

const router = express.Router();
const bookingService = new BookingService();

router.post('/create', async (req, res) => {
  try {
    const { doctorId, userId, slot } = req.body;

    // 空き枠チェック
    const isAvailable = await bookingService.checkAvailability(doctorId, slot);
    if (!isAvailable) {
      return res.status(400).json({ message: 'This time slot is not available.' });
    }

    // 予約重複防止
    const isDuplicate = await bookingService.checkDuplicateBooking(userId, slot);
    if (isDuplicate) {
      return res.status(400).json({ message: 'You have already booked an appointment for this time slot.' });
    }

    // 予約確定処理
    const booking = new Booking({
      doctorId,
      userId,
      slot,
      status: 'confirmed'
    });

    const savedBooking = await bookingService.createBooking(booking);

    // 通知トリガー
    bookingService.triggerNotification(savedBooking);

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;