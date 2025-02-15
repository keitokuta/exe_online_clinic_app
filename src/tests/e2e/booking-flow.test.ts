import request from 'supertest';
import app from '../../../app'; // Adjust the import path according to your project structure
import { User } from '../../../models/user';
import { Doctor } from '../../../models/doctor';
import { Booking } from '../../../models/booking';
import { setupDatabase } from '../../fixtures/db';

beforeEach(setupDatabase);

describe('Booking Flow E2E Tests', () => {
  it('should register a user, search for a doctor, create a booking, and use chat functionality', async () => {
    // User Registration
    const userResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    const user = await User.findById(userResponse.body.user._id);
    expect(user).not.toBeNull();
    expect(userResponse.body).toMatchObject({
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
      token: user.tokens[0].token,
    });

    // Doctor Search
    const doctorResponse = await request(app)
      .get('/api/v1/doctors/search')
      .send({ specialty: 'Cardiology' })
      .expect(200);

    expect(doctorResponse.body.length).toBeGreaterThan(0);
    const doctor = doctorResponse.body[0];
    expect(doctor).toMatchObject({
      specialty: 'Cardiology',
    });

    // Create Booking
    const bookingResponse = await request(app)
      .post('/api/v1/bookings/create')
      .set('Authorization', `Bearer ${userResponse.body.token}`)
      .send({
        doctorId: doctor._id,
        date: '2023-12-20',
        time: '10:00',
      })
      .expect(201);

    const booking = await Booking.findById(bookingResponse.body._id);
    expect(booking).not.toBeNull();
    expect(bookingResponse.body).toMatchObject({
      doctorId: doctor._id,
      userId: user._id,
      date: '2023-12-20',
      time: '10:00',
    });

    // Chat Functionality (Assuming a simple message sending test)
    const messageResponse = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${userResponse.body.token}`)
      .send({
        receiverId: doctor._id,
        message: 'Hello, Doctor!',
      })
      .expect(200);

    expect(messageResponse.body).toMatchObject({
      senderId: user._id,
      receiverId: doctor._id,
      message: 'Hello, Doctor!',
    });
  });
});