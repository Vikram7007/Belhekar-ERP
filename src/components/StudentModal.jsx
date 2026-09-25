import { useEffect, useState } from 'react';
import { IconClose } from './Icons';

const EMPTY_STUDENT = {
  name: '', gender: 'Male', dob: '', birthplace: '', category: 'General', aadhar: '', photo: '',
  father: '', mother: '', mobile: '', parentmobile: '', address: '',
  yearAdmission: 2026, academicYear: '2023-2024', yearClass: 'FE', dept: 'Computer Engineering', appid: '', enrollid: '', abc: '', email: '', cap: 'CAP Round I',
  regFee: 1500, tuiFee: 85000, scholarshipEligible: 'No', scholar1: 'Pending', scholar2: 'Pending'
};

const TABS = [
  { id: 'tab-personal', label: 'Personal Info' },
  { id: 'tab-family', label: 'Family & Address' },
  { id: 'tab-academic', label: 'Academic Details' },
  { id: 'tab-financial', label: 'Financial Track' }
];

export default function StudentModal({ mode, student, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [activeTab, setActiveTab] = useState('tab-personal');
  const readOnly = mode === 'view';

  useEffect(() => {
    if (student) {
      setForm({ ...EMPTY_STUDENT, ...student });
    } else {
      setForm(EMPTY_STUDENT);
    }
    setActiveTab('tab-personal');
  }, [student, mode]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (readOnly) return;

    const tuiFeeInput = parseFloat(form.tuiFee) || 0;
    let calculatedOutstanding = tuiFeeInput;
    if (form.scholarshipEligible === 'Yes') {
      calculatedOutstanding = tuiFeeInput / 2;
    }

    const studentObj = {
      ...form,
      photo: form.photo?.trim() || `https://api.dicebear.com/7.x/adventurer/svg?seed=${form.name}`,
      yearAdmission: parseInt(form.yearAdmission) || new Date().getFullYear(),
      regFee: parseFloat(form.regFee) || 0,
      tuiFee: tuiFeeInput
    };

    if (mode === 'new') {
      studentObj.outstanding = calculatedOutstanding;
      studentObj.marks = { k3: 0, k5: 0, k6: 0 };
    } else {
      studentObj.marks = student.marks || { k3: 0, k5: 0, k6: 0 };
      studentObj.outstanding = student.outstanding;
    }

    onSave(studentObj, mode, student ? student.enrollid : null);
  }

  const title = mode === 'new' ? 'Register New Student Profile'
    : mode === 'edit' ? 'Edit Student Profile Records'
    : 'View Student Details Profile';

  return (
    <div className="modal-overlay active" id="student-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="student-modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal-body">
          <div className="form-tabs">
            {TABS.map((t) => (
              <button
                type="button" key={t.id}
                className={`form-tab-btn${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form id="student-form" onSubmit={handleSubmit}>
            <div className={`form-tab-panel${activeTab === 'tab-personal' ? ' active' : ''}`} id="tab-personal">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="s-name">Student Full Name *</label>
                  <input type="text" id="s-name" className="form-input" placeholder="e.g. Ramesh Belhekar" required disabled={readOnly}
                    value={form.name} onChange={(e) => update('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-gender">Gender Selection *</label>
                  <select id="s-gender" className="form-input" required disabled={readOnly}
                    value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-dob">Date of Birth *</label>
                  <input type="date" id="s-dob" className="form-input" required disabled={readOnly}
                    value={form.dob} onChange={(e) => update('dob', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-birthplace">Birth Place</label>
                  <input type="text" id="s-birthplace" className="form-input" placeholder="City name" disabled={readOnly}
                    value={form.birthplace} onChange={(e) => update('birthplace', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-category">Category *</label>
                  <select id="s-category" className="form-input" required disabled={readOnly}
                    value={form.category} onChange={(e) => update('category', e.target.value)}>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-aadhar">Aadhar Card Number *</label>
                  <input type="text" id="s-aadhar" className="form-input" placeholder="12-digit number" pattern="\d{12}" required disabled={readOnly}
                    value={form.aadhar} onChange={(e) => update('aadhar', e.target.value)} />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="s-photo">Simulated Photo URL</label>
                  <input type="text" id="s-photo" className="form-input" placeholder="https://api.dicebear.com/7.x/adventurer/svg?seed=Ramesh" disabled={readOnly}
                    value={form.photo} onChange={(e) => update('photo', e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`form-tab-panel${activeTab === 'tab-family' ? ' active' : ''}`} id="tab-family">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="s-father">Father's Name *</label>
                  <input type="text" id="s-father" className="form-input" required disabled={readOnly}
                    value={form.father} onChange={(e) => update('father', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-mother">Mother's Name *</label>
                  <input type="text" id="s-mother" className="form-input" required disabled={readOnly}
                    value={form.mother} onChange={(e) => update('mother', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-mobile">Mobile Number *</label>
                  <input type="text" id="s-mobile" className="form-input" placeholder="10-digit number" pattern="\d{10}" required disabled={readOnly}
                    value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-parentmobile">Parent Mobile *</label>
                  <input type="text" id="s-parentmobile" className="form-input" placeholder="10-digit number" pattern="\d{10}" required disabled={readOnly}
                    value={form.parentmobile} onChange={(e) => update('parentmobile', e.target.value)} />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="s-address">Permanent Address *</label>
                  <textarea id="s-address" className="form-input" style={{ height: '80px' }} required disabled={readOnly}
                    value={form.address} onChange={(e) => update('address', e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`form-tab-panel${activeTab === 'tab-academic' ? ' active' : ''}`} id="tab-academic">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="s-year-admission">Year of Admission *</label>
                  <input type="number" id="s-year-admission" className="form-input" min="2010" max="2035" required disabled={readOnly}
                    value={form.yearAdmission} onChange={(e) => update('yearAdmission', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-academic-year">Academic Year *</label>
                  <select id="s-academic-year" className="form-input" required disabled={readOnly}
                    value={form.academicYear} onChange={(e) => update('academicYear', e.target.value)}>
                    <option value="2021-2022">2021-2022</option>
                    <option value="2022-2023">2022-2023</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-year-class">Current Class Year *</label>
                  <select id="s-year-class" className="form-input" required disabled={readOnly}
                    value={form.yearClass} onChange={(e) => update('yearClass', e.target.value)}>
                    <option value="FE">First Year (FE)</option>
                    <option value="SE">Second Year (SE)</option>
                    <option value="TE">Third Year (TE)</option>
                    <option value="BE">Final Year (BE)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-dept">Department *</label>
                  <select id="s-dept" className="form-input" required disabled={readOnly}
                    value={form.dept} onChange={(e) => update('dept', e.target.value)}>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-appid">Application ID *</label>
                  <input type="text" id="s-appid" className="form-input" placeholder="e.g. APP-40912" required disabled={readOnly}
                    value={form.appid} onChange={(e) => update('appid', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-enrollid">Enrollment ID *</label>
                  <input type="text" id="s-enrollid" className="form-input" placeholder="e.g. EN-26102" required disabled={readOnly || mode === 'edit'}
                    value={form.enrollid} onChange={(e) => update('enrollid', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-abc">Academic Bank of Credits (ABC) ID *</label>
                  <input type="text" id="s-abc" className="form-input" placeholder="e.g. ABC-789012" required disabled={readOnly}
                    value={form.abc} onChange={(e) => update('abc', e.target.value)} />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="s-email">Student Personal Email ID *</label>
                  <input type="email" id="s-email" className="form-input" placeholder="name@domain.com" required disabled={readOnly}
                    value={form.email} onChange={(e) => update('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-cap">Admission CAP Type *</label>
                  <select id="s-cap" className="form-input" required disabled={readOnly}
                    value={form.cap} onChange={(e) => update('cap', e.target.value)}>
                    <option value="CAP Round I">CAP Round I</option>
                    <option value="CAP Round II">CAP Round II</option>
                    <option value="Against CAP">Against CAP</option>
                    <option value="Institute Level">Institute Level</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`form-tab-panel${activeTab === 'tab-financial' ? ' active' : ''}`} id="tab-financial">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="s-reg-fee">Registration Fee Setup (₹) *</label>
                  <input type="number" id="s-reg-fee" className="form-input" required disabled={readOnly}
                    value={form.regFee} onChange={(e) => update('regFee', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-tui-fee">Total Tuition Fee (₹) *</label>
                  <input type="number" id="s-tui-fee" className="form-input" required disabled={readOnly}
                    value={form.tuiFee} onChange={(e) => update('tuiFee', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-scholarship-eligible">Scholarship Eligible *</label>
                  <select id="s-scholarship-eligible" className="form-input" required disabled={readOnly}
                    value={form.scholarshipEligible}
                    onChange={(e) => {
                      update('scholarshipEligible', e.target.value);
                      if (e.target.value === 'Yes') {
                        alert('Category scholarship eligibility applied: Tuition fee deduction will be computed.');
                      }
                    }}>
                    <option value="No">No</option>
                    <option value="Yes">Yes (50% Deduction)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-scholar-1">Scholarship 1st Installment</label>
                  <select id="s-scholar-1" className="form-input" disabled={readOnly}
                    value={form.scholar1} onChange={(e) => update('scholar1', e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Released">Released</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="s-scholar-2">Scholarship 2nd Installment</label>
                  <select id="s-scholar-2" className="form-input" disabled={readOnly}
                    value={form.scholar2} onChange={(e) => update('scholar2', e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Released">Released</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              {!readOnly && <button type="submit" className="btn">Save &amp; Commit Profile</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
