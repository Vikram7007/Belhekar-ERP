// Belhekar ERP - Roles config & seed/mock data

export const ROLES = {
  admin: {
    label: 'Admin Access',
    displayName: 'Administrator',
    username: 'admin.belhekar',
    password: 'Admin@2026',
    modules: ['dashboard', 'students', 'faculty', 'accounts', 'attendance', 'documents', 'academics', 'placements', 'compliance']
  },
  clerk: {
    label: 'Clerk Registry',
    displayName: 'Head Clerk Office',
    username: 'clerk.office',
    password: 'Clerk@2026',
    modules: ['dashboard', 'students', 'documents', 'placements']
  },
  faculty: {
    label: 'Faculty Portal',
    displayName: 'Prof. Nitin Belhekar',
    username: 'faculty.portal',
    password: 'Faculty@2026',
    modules: ['dashboard', 'students', 'faculty', 'attendance', 'academics']
  },
  accountant: {
    label: 'Accounts Desk',
    displayName: 'Chief Accountant',
    username: 'accounts.desk',
    password: 'Accounts@2026',
    modules: ['dashboard', 'accounts']
  }
};

export const SEED_DATA = {
  students: [
    {
      enrollid: 'EN-26101', name: 'Ramesh Balhekar', gender: 'Male', dob: '2004-05-14',
      birthplace: 'Pune', category: 'OBC', aadhar: '998877665544',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ramesh',
      father: 'Vithal Balhekar', mother: 'Lata Balhekar', mobile: '9876543210',
      parentmobile: '9876543211', address: 'Plot 42, Viman Nagar, Pune - 411014',
      academicYear: '2025-2026', yearAdmission: 2023, yearClass: 'BE', dept: 'Computer Engineering',
      appid: 'APP-10201', enrollidOrig: 'EN-26101', abc: 'ABC-12345678',
      email: 'ramesh.b@gmail.com', cap: 'CAP Round I', regFee: 1500, tuiFee: 85000,
      scholarshipEligible: 'Yes', scholar1: 'Released', scholar2: 'Pending',
      outstanding: 42500, marks: { k3: 18, k5: 35, k6: 32 }
    },
    {
      enrollid: 'EN-26102', name: 'Sneha Patil', gender: 'Female', dob: '2005-09-21',
      birthplace: 'Sangli', category: 'General', aadhar: '112233445566',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sneha',
      father: 'Sanjay Patil', mother: 'Mangal Patil', mobile: '9812345678',
      parentmobile: '9812345679', address: 'Shivaji Square, Sangli - 416416',
      academicYear: '2025-2026', yearAdmission: 2024, yearClass: 'TE', dept: 'Computer Engineering',
      appid: 'APP-10202', abc: 'ABC-87654321', email: 'sneha.p@gmail.com',
      cap: 'CAP Round II', regFee: 1500, tuiFee: 85000,
      scholarshipEligible: 'No', scholar1: 'N/A', scholar2: 'N/A',
      outstanding: 0, marks: { k3: 19, k5: 38, k6: 37 }
    },
    {
      enrollid: 'EN-26103', name: 'Amit Joshi', gender: 'Male', dob: '2006-11-02',
      birthplace: 'Nashik', category: 'General', aadhar: '887766554433',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Amit',
      father: 'Kiran Joshi', mother: 'Urmila Joshi', mobile: '9922334455',
      parentmobile: '9922334456', address: 'Deolali Camp, Nashik Road - 422001',
      academicYear: '2025-2026', yearAdmission: 2025, yearClass: 'SE', dept: 'Mechanical Engineering',
      appid: 'APP-10203', abc: 'ABC-11223344', email: 'amit.j@gmail.com',
      cap: 'Against CAP', regFee: 1500, tuiFee: 85000,
      scholarshipEligible: 'No', scholar1: 'N/A', scholar2: 'N/A',
      outstanding: 85000, marks: { k3: 15, k5: 28, k6: 30 }
    },
    {
      enrollid: 'EN-26104', name: 'Priya More', gender: 'Female', dob: '2007-01-15',
      birthplace: 'Kolhapur', category: 'SC', aadhar: '556677889900',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
      father: 'Govind More', mother: 'Pratibha More', mobile: '9011223344',
      parentmobile: '9011223345', address: 'Rajarampuri, Kolhapur - 416008',
      academicYear: '2025-2026', yearAdmission: 2026, yearClass: 'FE', dept: 'Electrical Engineering',
      appid: 'APP-10204', abc: 'ABC-55667788', email: 'priya.more@gmail.com',
      cap: 'CAP Round I', regFee: 1500, tuiFee: 85000,
      scholarshipEligible: 'Yes', scholar1: 'Released', scholar2: 'Released',
      outstanding: 0, marks: { k3: 17, k5: 32, k6: 34 }
    },
    {
      enrollid: 'EN-26105', name: 'Vicky Jadhav', gender: 'Male', dob: '2004-08-30',
      birthplace: 'Mumbai', category: 'General', aadhar: '445566778899',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vicky',
      father: 'Dilip Jadhav', mother: 'Sunita Jadhav', mobile: '8877990011',
      parentmobile: '8877990012', address: 'Andheri East, Mumbai - 400069',
      academicYear: '2025-2026', yearAdmission: 2023, yearClass: 'BE', dept: 'Civil Engineering',
      appid: 'APP-10205', abc: 'ABC-44332211', email: 'vicky.j@gmail.com',
      cap: 'Institute Level', regFee: 1500, tuiFee: 85000,
      scholarshipEligible: 'No', scholar1: 'N/A', scholar2: 'N/A',
      outstanding: 0, marks: { k3: 16, k5: 30, k6: 31 }
    },
    {
      enrollid: 'EN-26106', name: 'Swati Shinde', gender: 'Female', dob: '2004-03-24',
      birthplace: 'Satara', category: 'OBC', aadhar: '667788990011',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Swati',
      father: 'Babasaheb Shinde', mother: 'Alka Shinde', mobile: '7766554433',
      parentmobile: '7766554434', address: 'Powai Naka, Satara - 415001',
      academicYear: '2025-2026', yearAdmission: 2023, yearClass: 'BE', dept: 'Computer Engineering',
      appid: 'APP-10206', abc: 'ABC-99001122', email: 'swati.s@gmail.com',
      cap: 'CAP Round II', regFee: 1500, tuiFee: 85000,
      scholarshipEligible: 'Yes', scholar1: 'Released', scholar2: 'Released',
      outstanding: 0, marks: { k3: 18, k5: 36, k6: 35 }
    }
  ],
  faculty: [
    {
      id: 'FAC-101', name: 'Prof. Nitin Belhekar', gender: 'Male', dob: '1978-04-12',
      category: 'General', aadhar: '887766551122', pan: 'ABCDE1234F',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nitin',
      father: 'Suresh Belhekar', mother: 'Geeta Belhekar', mobile: '9865432100',
      parentmobile: '9865432101', address: 'Belhekar Villa, Erandwane, Pune - 411004',
      joiningYear: 2012, dept: 'Computer Engineering', designation: 'HOD',
      qualification: 'Ph.D in Computer Engineering', email: 'nitin.belhekar@college.co.in',
      bankAcc: '34567890123', bankIfsc: 'SBIN0001043', bankBranch: 'Deccan Gymkhana', salary: 95000
    },
    {
      id: 'FAC-102', name: 'Dr. Swati Deshmukh', gender: 'Female', dob: '1982-08-25',
      category: 'General', aadhar: '776655442233', pan: 'XYZAB5678C',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Swati',
      father: 'Madhukar Deshmukh', mother: 'Asha Deshmukh', mobile: '9855443322',
      parentmobile: '9855443323', address: 'Kothrud, Pune - 411038',
      joiningYear: 2015, dept: 'Mechanical Engineering', designation: 'Professor',
      qualification: 'Ph.D in Heat Power', email: 'swati.deshmukh@college.co.in',
      bankAcc: '90876543210', bankIfsc: 'HDFC0000104', bankBranch: 'Kothrud Branch', salary: 82000
    },
    {
      id: 'FAC-103', name: 'Prof. Sunil Kulkarni', gender: 'Male', dob: '1988-12-05',
      category: 'General', aadhar: '665544331122', pan: 'KLMNO9012D',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunil',
      father: 'Ramchandra Kulkarni', mother: 'Sunanda Kulkarni', mobile: '9033445566',
      parentmobile: '9033445567', address: 'Sinhagad Road, Pune - 411041',
      joiningYear: 2018, dept: 'Electrical Engineering', designation: 'Associate Professor',
      qualification: 'M.Tech in Power Systems', email: 'sunil.k@college.co.in',
      bankAcc: '45678901234', bankIfsc: 'ICIC0000204', bankBranch: 'Sinhagad Road', salary: 68000
    },
    {
      id: 'FAC-104', name: 'Prof. Anjali Patil', gender: 'Female', dob: '1992-06-19',
      category: 'OBC', aadhar: '554433221100', pan: 'PQRST3456E',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
      father: 'Vijay Patil', mother: 'Rekha Patil', mobile: '9988112233',
      parentmobile: '9988112234', address: 'Hadapsar, Pune - 411028',
      joiningYear: 2021, dept: 'Civil Engineering', designation: 'Assistant Professor',
      qualification: 'M.E. in Structures', email: 'anjali.p@college.co.in',
      bankAcc: '12345678901', bankIfsc: 'BARB0HADAPS', bankBranch: 'Hadapsar', salary: 52000
    }
  ],
  transactions: [
    { txId: 'TXN-901201', enrollid: 'EN-26101', name: 'Ramesh Balhekar', type: 'Tuition Fees', amount: 42500, mode: 'UPI / Online', date: '2026-07-28 10:14' },
    { txId: 'TXN-901202', enrollid: 'EN-26102', name: 'Sneha Patil', type: 'Tuition Fees', amount: 85000, mode: 'UPI / Online', date: '2026-07-29 14:22' },
    { txId: 'TXN-901203', enrollid: 'EN-26104', name: 'Priya More', type: 'Tuition Fees', amount: 42500, mode: 'Scholarship Disbursement', date: '2026-07-30 09:30' },
    { txId: 'TXN-901204', enrollid: 'EN-26105', name: 'Vicky Jadhav', type: 'Tuition Fees', amount: 85000, mode: 'Bank Transfer', date: '2026-07-30 11:45' }
  ],
  placements: [
    { name: 'Ramesh Balhekar', enrollid: 'EN-26101', dept: 'Computer Engineering', company: 'Tata Consultancy Services', package: 6.5, year: '2026-27' },
    { name: 'Vicky Jadhav', enrollid: 'EN-26105', dept: 'Civil Engineering', company: 'Larsen & Toubro', package: 5.5, year: '2026-27' },
    { name: 'Swati Shinde', enrollid: 'EN-26106', dept: 'Computer Engineering', company: 'Cognizant Technology Solutions', package: 4.5, year: '2026-27' }
  ],
  alumni: [
    { name: 'Sameer Kadam', enrollid: 'EN-24098', year: '2025', dept: 'Computer Engineering' },
    { name: 'Tejaswini Joshi', enrollid: 'EN-24103', year: '2025', dept: 'Mechanical Engineering' },
    { name: 'Omkar Shinde', enrollid: 'EN-23987', year: '2024', dept: 'Electrical Engineering' }
  ],
  // One record per Department + Year/Class + Date. Only absentees are stored;
  // every other enrolled student in that class is implicitly Present.
  attendance: [
    {
      id: 'ATT-CE-BE-2026-08-11',
      date: '2026-08-11', dept: 'Computer Engineering', yearClass: 'BE',
      totalStudents: 2, absentees: [{ enrollid: 'EN-26106', name: 'Swati Shinde' }],
      presentCount: 1, absentCount: 1,
      markedBy: { name: 'Prof. Nitin Belhekar', role: 'faculty' }, markedAt: '2026-08-11T04:05:00.000Z',
      updatedBy: null, updatedAt: null
    },
    {
      id: 'ATT-CE-BE-2026-08-12',
      date: '2026-08-12', dept: 'Computer Engineering', yearClass: 'BE',
      totalStudents: 2, absentees: [],
      presentCount: 2, absentCount: 0,
      markedBy: { name: 'Prof. Nitin Belhekar', role: 'faculty' }, markedAt: '2026-08-12T04:02:00.000Z',
      updatedBy: null, updatedAt: null
    },
    {
      id: 'ATT-CE-BE-2026-08-13',
      date: '2026-08-13', dept: 'Computer Engineering', yearClass: 'BE',
      totalStudents: 2, absentees: [{ enrollid: 'EN-26101', name: 'Ramesh Balhekar' }],
      presentCount: 1, absentCount: 1,
      markedBy: { name: 'Administrator', role: 'admin' }, markedAt: '2026-08-13T04:10:00.000Z',
      updatedBy: null, updatedAt: null
    }
  ],
  attendanceAudit: [
    {
      id: 'AUD-seed-1', action: 'MARK_ATTENDANCE', by: 'Prof. Nitin Belhekar', role: 'faculty',
      timestamp: '2026-08-11T04:05:00.000Z',
      details: 'Computer Engineering / BE — 11 Aug 2026: 1 absent of 2 students'
    },
    {
      id: 'AUD-seed-2', action: 'MARK_ATTENDANCE', by: 'Prof. Nitin Belhekar', role: 'faculty',
      timestamp: '2026-08-12T04:02:00.000Z',
      details: 'Computer Engineering / BE — 12 Aug 2026: 0 absent of 2 students'
    },
    {
      id: 'AUD-seed-3', action: 'MARK_ATTENDANCE', by: 'Administrator', role: 'admin',
      timestamp: '2026-08-13T04:10:00.000Z',
      details: 'Computer Engineering / BE — 13 Aug 2026: 1 absent of 2 students'
    }
  ]
};

export const DEPARTMENTS = ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'];
export const YEAR_CLASSES = [
  { value: 'FE', label: 'First Year (FE)' },
  { value: 'SE', label: 'Second Year (SE)' },
  { value: 'TE', label: 'Third Year (TE)' },
  { value: 'BE', label: 'Final Year (BE)' }
];
