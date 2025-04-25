import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const url = 'http://localhost:3000/users';

type Savings = {
  id: number;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
};

const SavingsManagement: React.FC = () => {
  const [savings, setSavings] = useState<Savings[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSavings, setFilteredSavings] = useState<Savings[]>([]);
  const [searchResult, setSearchResult] = useState<Savings[]>([]);
  const [saving, setSaving] = useState<Omit<Savings, 'id'>>({
    category: '',
    amount: 0,
    date: '',
    paymentMethod: '',
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(0);

  const fetchSavings = async () => {
    const res = await Axios.get(url);
    setSavings(res.data);
    setFilteredSavings(res.data);
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      await Axios.put(`${url}/${editId}`, saving);
    } else {
      await Axios.post(url, saving);
    }
    setSaving({
      category: '',
      amount: 0,
      date: '',
      paymentMethod: '',
    });
    fetchSavings();
    resetForm();
  };

  const handleDelete = async (id: number) => {
    await Axios.delete(`${url}/${id}`);
    fetchSavings();
  };

  const handleEdit = async (id: number) => {
    const res = await Axios.get(`${url}/${id}`);
    setSaving(res.data);
    setIsEdit(true);
    setEditId(id);
  };

  const resetForm = () => {
    setSaving({
      category: '',
      amount: 0,
      date: '',
      paymentMethod: '',
    });
    setIsEdit(false);
    setEditId(0);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = savings.filter((saving) =>
      saving.id.toString().includes(searchTerm) ||
      saving.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSavings(filtered);
    setSearchResult(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredSavings(savings);
  };

  return (
    <div className="ui container" style={{ backgroundColor: '#E6F7ED', padding: '3em', border: '2px solid #3E8E41', borderRadius: '15px' }}>
      <h2 className='ui header' style={{ color: '#3E8E41', textAlign: 'center', fontSize: '2.5em' }}>Savings Management</h2>
      <form className="ui form" onSubmit={handleSubmit} style={{ marginBottom: '2em' }}>
        <div className='field'>
          <label htmlFor="category" style={{ color: '#3E8E41' }}>Category</label>
          <input type="text" id="category" placeholder="Category" value={saving.category} onChange={(e) => setSaving({ ...saving, category: e.target.value })} style={{ backgroundColor: '#C6E2B5', color: '#3E8E41', width: '300px' }} />
        </div>
        <div className='field'>
          <label htmlFor="amount" style={{ color: '#3E8E41' }}>Amount</label>
          <input type="number" id="amount" placeholder="Amount" value={saving.amount} onChange={(e) => setSaving({ ...saving, amount: parseFloat(e.target.value) })} style={{ backgroundColor: '#C6E2B5', color: '#3E8E41', width: '300px' }} />
        </div>
        <div className='field'>
          <label htmlFor="date" style={{ color: '#3E8E41' }}>Date</label>
          <input type="date" id="date" value={saving.date} onChange={(e) => setSaving({ ...saving, date: e.target.value })} style={{ backgroundColor: '#C6E2B5', color: '#3E8E41', width: '300px' }} />
        </div>
        <div className='field'>
          <label htmlFor="paymentMethod" style={{ color: '#3E8E41' }}>Payment Method</label>
          <input type="text" id="paymentMethod" placeholder="Payment Method" value={saving.paymentMethod} onChange={(e) => setSaving({ ...saving, paymentMethod: e.target.value })} style={{ backgroundColor: '#C6E2B5', color: '#3E8E41', width: '300px' }} />
        </div>
        <button className="ui primary button" type="submit" style={{ backgroundColor: '#3E8E41', color: 'white', width: '150px', marginRight: '10px' }}>{isEdit ? 'Update' : 'Add'}</button>
        <button className="ui red button" type="button" onClick={resetForm} style={{ backgroundColor: '#E2786F', color: 'white', width: '150px' }}>Cancel</button>
      </form>
      <h3 style={{ textAlign: 'center', color: '#3E8E41' }}>Savings List</h3>
      <div className="ui grid" style={{ marginBottom: '2em' }}>
        <div className="sixteen wide column">
          <table className='ui celled table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSavings.map((saving) => (
                <tr key={saving.id}>
                  <td>{saving.id}</td>
                  <td>{saving.category}</td>
                  <td>${saving.amount}</td>
                  <td>{saving.date}</td>
                  <td>{saving.paymentMethod}</td>
                  <td>
                    <button className='ui primary button'
                      onClick={() => handleEdit(saving.id)} style={{ backgroundColor: '#3E8E41', color: 'white', width: '100px', marginRight: '5px' }}>Edit</button>
                    <button className='ui red button' onClick={() => handleDelete(saving.id)} style={{ backgroundColor: '#E2786F', color: 'white', width: '100px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <form className="ui form" onSubmit={handleSearch}>
        <div className='field'>
          <label htmlFor="search" style={{ color: '#3E8E41' }}>Search</label>
          <input type="text" id="search" placeholder="Search by ID or Category" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ backgroundColor: '#C6E2B5', color: '#3E8E41', width: '300px' }} />
        </div>
        <button className="ui primary button" type="submit" style={{ backgroundColor: '#3E8E41', color: 'white', width: '150px', marginRight: '10px' }}>Search</button>
        <button className="ui button" type="button" onClick={handleClearSearch} style={{ backgroundColor: '#C6E2B5', color: '#3E8E41', width: '150px' }}>Clear Search</button>
      </form>
      <div className="ui segment" style={{ display: 'block', backgroundColor: '#C6E2B5', marginTop: '2em' }}>
        <h4>Search Result</h4>
        {searchResult.length ? (
          <table className='ui celled table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((saving) => (
                <tr key={saving.id}>
                  <td>{saving.id}</td>
                  <td>{saving.category}</td>
                  <td>${saving.amount}</td>
                  <td>{saving.date}</td>
                  <td>{saving.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', color: '#3E8E41' }}>No results found. Please try a different search term.</div>
        )}
      </div>
    </div>
  );
};

export default SavingsManagement;

