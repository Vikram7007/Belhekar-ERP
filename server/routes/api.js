import express from 'express';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Transaction from '../models/Transaction.js';
import Placement from '../models/Placement.js';
import Alumni from '../models/Alumni.js';
import Attendance from '../models/Attendance.js';
import AttendanceAudit from '../models/AttendanceAudit.js';
import { SEED_DATA } from '../../src/data/seed.js';
import mongoose from 'mongoose';

const router = express.Router();

// Database Seeding Helper
export const seedDatabaseIfEmpty = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected. Skipping seeding.');
    return;
  }
  try {
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log('Database is empty. Seeding initial data...');
      
      const { students, faculty, transactions, placements, alumni, attendance, attendanceAudit } = SEED_DATA;

      if (students && students.length > 0) await Student.insertMany(students);
      if (faculty && faculty.length > 0) await Faculty.insertMany(faculty);
      if (transactions && transactions.length > 0) await Transaction.insertMany(transactions);
      if (placements && placements.length > 0) await Placement.insertMany(placements);
      if (alumni && alumni.length > 0) await Alumni.insertMany(alumni);
      if (attendance && attendance.length > 0) await Attendance.insertMany(attendance);
      if (attendanceAudit && attendanceAudit.length > 0) await AttendanceAudit.insertMany(attendanceAudit);
      
      console.log('Database seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Global DB Get State
router.get('/db', async (req, res) => {
  try {
    const students = await Student.find({});
    const faculty = await Faculty.find({});
    const transactions = await Transaction.find({});
    const placements = await Placement.find({});
    const alumni = await Alumni.find({});
    const attendance = await Attendance.find({});
    const attendanceAudit = await AttendanceAudit.find({});

    res.json({
      students,
      faculty,
      transactions,
      placements,
      alumni,
      attendance,
      attendanceAudit
    });
  } catch (error) {
    console.error('Fetch DB error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Global DB Sync State
router.post('/db/sync', async (req, res) => {
  try {
    const { students, faculty, transactions, placements, alumni, attendance, attendanceAudit } = req.body;

    if (students) {
      await Student.deleteMany({});
      await Student.insertMany(students);
    }
    if (faculty) {
      await Faculty.deleteMany({});
      await Faculty.insertMany(faculty);
    }
    if (transactions) {
      await Transaction.deleteMany({});
      await Transaction.insertMany(transactions);
    }
    if (placements) {
      await Placement.deleteMany({});
      await Placement.insertMany(placements);
    }
    if (alumni) {
      await Alumni.deleteMany({});
      await Alumni.insertMany(alumni);
    }
    if (attendance) {
      await Attendance.deleteMany({});
      await Attendance.insertMany(attendance);
    }
    if (attendanceAudit) {
      await AttendanceAudit.deleteMany({});
      await AttendanceAudit.insertMany(attendanceAudit);
    }

    res.json({ message: 'Database state synced successfully!' });
  } catch (error) {
    console.error('Sync DB error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DB Reset and Seed
router.post('/db/seed', async (req, res) => {
  try {
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Transaction.deleteMany({});
    await Placement.deleteMany({});
    await Alumni.deleteMany({});
    await Attendance.deleteMany({});
    await AttendanceAudit.deleteMany({});

    const { students, faculty, transactions, placements, alumni, attendance, attendanceAudit } = SEED_DATA;
    if (students && students.length > 0) await Student.insertMany(students);
    if (faculty && faculty.length > 0) await Faculty.insertMany(faculty);
    if (transactions && transactions.length > 0) await Transaction.insertMany(transactions);
    if (placements && placements.length > 0) await Placement.insertMany(placements);
    if (alumni && alumni.length > 0) await Alumni.insertMany(alumni);
    if (attendance && attendance.length > 0) await Attendance.insertMany(attendance);
    if (attendanceAudit && attendanceAudit.length > 0) await AttendanceAudit.insertMany(attendanceAudit);

    res.json({ message: 'Database reset and seeded successfully!' });
  } catch (error) {
    console.error('Seed DB error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Students REST Routes
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/students/:enrollid', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { enrollid: req.params.enrollid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/students/:enrollid', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ enrollid: req.params.enrollid });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Faculty REST Routes
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find({});
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/faculty', async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Transactions REST Routes
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Placements REST Routes
router.get('/placements', async (req, res) => {
  try {
    const placements = await Placement.find({});
    res.json(placements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/placements', async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();
    res.status(201).json(placement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Alumni REST Routes
router.get('/alumni', async (req, res) => {
  try {
    const alumni = await Alumni.find({});
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/alumni', async (req, res) => {
  try {
    const alum = new Alumni(req.body);
    await alum.save();
    res.status(201).json(alum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Attendance REST Routes
router.get('/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({});
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/attendance', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/attendance/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AttendanceAudit REST Routes
router.get('/attendanceAudit', async (req, res) => {
  try {
    const audit = await AttendanceAudit.find({});
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/attendanceAudit', async (req, res) => {
  try {
    const audit = new AttendanceAudit(req.body);
    await audit.save();
    res.status(201).json(audit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
