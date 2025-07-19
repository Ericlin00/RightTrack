import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Fetch jobs on load
  useEffect(() => {
    axios.get('http://localhost:3001/jobs')
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/jobs', { company, role, status })
      .then(() => {
        setCompany('');
        setRole('');
        setStatus('');
        return axios.get('http://localhost:3001/jobs');
      })
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RightTrack – Job Tracker</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Add Job
        </button>
      </form>

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
