import { useEffect, useState } from 'react';
import { IconClose } from './Icons';

const EMPTY_FACULTY = {
  name: '', gender: 'Male', dob: '', category: 'General', aadhar: '', pan: '', photo: '',
  father: '', mother: '', mobile: '', parentmobile: '', address: '',
  joiningYear: 2020, dept: 'Computer Engineering', designation: 'HOD', qualification: '', email: '',
  bankAcc: '', bankIfsc: '', bankBranch: '', salary: 65000
};

export default function FacultyModal({ mode, faculty, facultyCount, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FACULTY);
  const readOnly = mode === 'view';

  useEffect(() => {
    if (faculty) {
      setForm({ ...EMPTY_FACULTY, ...faculty });
    } else {
      setForm(EMPTY_FACULTY);
    }
  }, [faculty, mode]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (readOnly) return;

    const facObj = {
      ...form,
      id: mode === 'new' ? 'FAC-' + (100 + facultyCount + 1) : faculty.id,
      pan: form.pan.trim().toUpperCase(),
      photo: form.photo?.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
      joiningYear: parseInt(form.joiningYear) || new Date().getFullYear(),
      salary: parseFloat(form.salary) || 0
    };

    onSave(facObj, mode, faculty ? faculty.id : null);
  }

  const title = mode === 'new' ? 'Register New Faculty Profile'
    : mode === 'edit' ? 'Edit Faculty Profile Ledger'
    : 'View Faculty Details Profile';

  return (
    <div className="modal-overlay active" id="faculty-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="faculty-modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal-body">
          <form id="faculty-form" onSubmit={handleSubmit}>
            <div className="form-section-title">Personal Data</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="f-name">Full Name *</label>
                <input type="text" id="f-name" className="form-input" placeholder="e.g. Prof. Nitin Belhekar" required disabled={readOnly}
                  value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-gender">Gender *</label>
                <select id="f-gender" className="form-input" required disabled={readOnly}
                  value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="f-dob">DOB *</label>
                <input type="date" id="f-dob" className="form-input" required disabled={readOnly}
                  value={form.dob} onChange={(e) => update('dob', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-category">Category *</label>
                <select id="f-category" className="form-input" required disabled={readOnly}
                  value={form.category} onChange={(e) => update('category', e.target.value)}>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="f-aadhar">Aadhar Details *</label>
                <input type="text" id="f-aadhar" className="form-input" placeholder="12-digit number" pattern="\d{12}" required disabled={readOnly}
                  value={form.aadhar} onChange={(e) => update('aadhar', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-pan">PAN Details *</label>
                <input type="text" id="f-pan" className="form-input" placeholder="10-character PAN" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required disabled={readOnly}
                  value={form.pan} onChange={(e) => update('pan', e.target.value)} />
              </div>
              <div className="form-group form-group-full">
                <label htmlFor="f-photo">Simulated Photo URL</label>
                <input type="text" id="f-photo" className="form-input" placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=Nitin" disabled={readOnly}
                  value={form.photo} onChange={(e) => update('photo', e.target.value)} />
              </div>
            </div>

            <div className="form-section-title">Family &amp; Contacts</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="f-father">Father's Name</label>
                <input type="text" id="f-father" className="form-input" disabled={readOnly}
                  value={form.father} onChange={(e) => update('father', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-mother">Mother's Name</label>
                <input type="text" id="f-mother" className="form-input" disabled={readOnly}
                  value={form.mother} onChange={(e) => update('mother', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-mobile">Mobile Number *</label>
                <input type="text" id="f-mobile" className="form-input" placeholder="10-digit number" pattern="\d{10}" required disabled={readOnly}
                  value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-parentmobile">Emergency/Parent Mobile</label>
                <input type="text" id="f-parentmobile" className="form-input" placeholder="10-digit number" pattern="\d{10}" disabled={readOnly}
                  value={form.parentmobile} onChange={(e) => update('parentmobile', e.target.value)} />
              </div>
              <div className="form-group form-group-full">
                <label htmlFor="f-address">Permanent Address *</label>
                <textarea id="f-address" className="form-input" style={{ height: '60px' }} required disabled={readOnly}
                  value={form.address} onChange={(e) => update('address', e.target.value)} />
              </div>
            </div>

            <div className="form-section-title">Professional Data</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="f-year-joining">Year of Joining *</label>
                <input type="number" id="f-year-joining" className="form-input" required disabled={readOnly}
                  value={form.joiningYear} onChange={(e) => update('joiningYear', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-dept">Department *</label>
                <select id="f-dept" className="form-input" required disabled={readOnly}
                  value={form.dept} onChange={(e) => update('dept', e.target.value)}>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="f-designation">Designation *</label>
                <select id="f-designation" className="form-input" required disabled={readOnly}
                  value={form.designation} onChange={(e) => update('designation', e.target.value)}>
                  <option value="HOD">HOD / Department Head</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="f-qualification">Qualification *</label>
                <input type="text" id="f-qualification" className="form-input" placeholder="e.g. Ph.D, M.Tech" required disabled={readOnly}
                  value={form.qualification} onChange={(e) => update('qualification', e.target.value)} />
              </div>
              <div className="form-group form-group-full">
                <label htmlFor="f-email">Faculty Email ID *</label>
                <input type="email" id="f-email" className="form-input" placeholder="prof.name@college.co.in" required disabled={readOnly}
                  value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>

            <div className="form-section-title">Financial &amp; Bank Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="f-bank-account">Bank Account Number *</label>
                <input type="text" id="f-bank-account" className="form-input" placeholder="e.g. 34091203498" required disabled={readOnly}
                  value={form.bankAcc} onChange={(e) => update('bankAcc', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-bank-ifsc">IFSC Bank Code *</label>
                <input type="text" id="f-bank-ifsc" className="form-input" placeholder="e.g. SBIN000104" required disabled={readOnly}
                  value={form.bankIfsc} onChange={(e) => update('bankIfsc', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-bank-branch">Branch Name *</label>
                <input type="text" id="f-bank-branch" className="form-input" placeholder="Main Branch" required disabled={readOnly}
                  value={form.bankBranch} onChange={(e) => update('bankBranch', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="f-salary">Net Payment / Monthly Salary (₹) *</label>
                <input type="number" id="f-salary" className="form-input" required disabled={readOnly}
                  value={form.salary} onChange={(e) => update('salary', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              {!readOnly && <button type="submit" className="btn">Save Faculty Record</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
