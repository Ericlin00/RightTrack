import React, { useEffect, useState } from 'react';
import api from './api';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Fetch jobs on load
  useEffect(() => {
    api.get('/jobs')
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/jobs', { company, role, status })
      .then(() => {
        setCompany('');
        setRole('');
        setStatus('');
        return api.get('/jobs');
      })
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-8 text-white">
      <h1 className="text-2xl font-bold">RightTrack – Job Tracker</h1>

      {/* Register and Login Forms */}
      <div className="grid md:grid-cols-2 gap-4">
        <RegisterForm />
        <LoginForm />
      </div>

      {/* Job Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          className="border p-2 w-full text-black"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="border p-2 w-full text-black"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className="border p-2 w-full text-black"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Add Job
        </button>
      </form>

      {/* Job List */}
      <ul className="space-y-2">
        {jobs.map((job, idx) => (
          <li key={idx} className="border p-2 rounded">
            <strong>{job.company}</strong> – {job.role} [{job.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;