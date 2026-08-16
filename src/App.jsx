import { useEffect, useState } from 'react';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from './api';
import './styles.css';

const emptyEmployee = { id: '', name: '', experience: '', companyName: '', skills: '' };

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyEmployee);
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState('add');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadEmployees(nextPage = page) {
    try {
      setError('');
      const data = await getEmployees(Math.max(nextPage, 0), 8);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Unable to load employees: ${err.message}`);
    }
  }

  useEffect(() => { loadEmployees(page); }, [page]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      setError('');
      if (mode === 'add') {
        await createEmployee({ ...form, id: undefined });
        setMessage('Employee created successfully.');
      } else {
        await updateEmployee({ ...form, id: Number(form.id) });
        setMessage('Employee updated successfully.');
      }
      setForm(emptyEmployee);
      setMode('add');
      await loadEmployees(page);
    } catch (err) {
      setError(`Operation failed: ${err.message}`);
    }
  }

  async function remove(id) {
    if (!window.confirm(`Delete employee ${id}?`)) return;
    try {
      await deleteEmployee(id);
      setMessage('Employee deleted successfully.');
      await loadEmployees(page);
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    }
  }

  function edit(employee) {
    setMode('edit');
    setForm({
      id: employee.id ?? '',
      name: employee.name ?? '',
      experience: employee.experience ?? '',
      companyName: employee.companyName ?? '',
      skills: employee.skills ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Employee Management</h1>
          <p>React + Spring Boot CRUD application</p>
        </div>
      </header>

      <main className="content">
        {(message || error) && <div className={error ? 'alert error' : 'alert success'}>{error || message}</div>}

        <section className="card">
          <div className="section-title">
            <h2>{mode === 'add' ? 'Add Employee' : 'Update Employee'}</h2>
            {mode === 'edit' && <button className="secondary" onClick={() => { setMode('add'); setForm(emptyEmployee); }}>Cancel</button>}
          </div>
          <form onSubmit={submit} className="form-grid">
            {mode === 'edit' && <label>Employee ID<input name="id" type="number" value={form.id} onChange={updateField} required /></label>}
            <label>Name<input name="name" value={form.name} onChange={updateField} required /></label>
            <label>Experience (Years)<input name="experience" value={form.experience} onChange={updateField} required /></label>
            <label>Company Name<input name="companyName" value={form.companyName} onChange={updateField} required /></label>
            <label className="wide">Skills (comma separated)<textarea name="skills" value={form.skills} onChange={updateField} required /></label>
            <div className="wide actions"><button type="submit">{mode === 'add' ? 'Create Employee' : 'Update Employee'}</button><button type="button" className="secondary" onClick={() => setForm(emptyEmployee)}>Reset</button></div>
          </form>
        </section>

        <section className="card">
          <div className="section-title"><h2>Employees</h2><button className="secondary" onClick={() => loadEmployees(page)}>Refresh</button></div>
          {employees.length === 0 ? <p>No employees found.</p> : (
            <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Experience</th><th>Company</th><th>Skills</th><th>Actions</th></tr></thead>
              <tbody>{employees.map((employee) => <tr key={employee.id}><td>{employee.id}</td><td>{employee.name}</td><td>{employee.experience}</td><td>{employee.companyName}</td><td>{employee.skills}</td><td><button className="small" onClick={() => edit(employee)}>Edit</button> <button className="small danger" onClick={() => remove(employee.id)}>Delete</button></td></tr>)}</tbody>
            </table></div>
          )}
          <div className="pagination"><button className="secondary" disabled={page === 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>Previous</button><span>Page {page + 1}</span><button className="secondary" onClick={() => setPage((p) => p + 1)}>Next</button></div>
        </section>
      </main>
    </div>
  );
}

export default App;
