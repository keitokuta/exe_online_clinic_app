import express from 'express';
import { DoctorService } from '../services/doctor-service';
import { Doctor } from '../models/doctor';

const router = express.Router();
const doctorService = new DoctorService();

router.get('/search', async (req, res) => {
  try {
    const { specialty, region, page = 1, limit = 10 } = req.query;

    const filters = {
      ...(specialty && { specialty }),
      ...(region && { region }),
    };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const doctors = await doctorService.searchDoctors(filters, options);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;