"use client";
import { useState, useEffect } from 'react';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');

  const fetchExpenses = async () => {
    const response = await fetch('/api/expenses');
    const data = await response.json();
    setExpenses(data);
  };

  const addExpense = async (e) => {
    e.preventDefault();
    const method = editMode ? 'PUT' : 'POST';
    const body = JSON.stringify(editMode ? { id: editId, description, amount } : { description, amount });

    await fetch('/api/expenses', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    setDescription('');
    setAmount('');
    setEditMode(false);
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    const response = await fetch('/api/expenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }), // Send ID in the request body
    });

    if (!response.ok) {
      console.error('Failed to delete expense:', await response.json());
    } else {
      fetchExpenses(); // Refresh the expense list after deletion
    }
  };

  const editExpense = (expense) => {
    setDescription(expense.description);
    setAmount(expense.amount);
    setEditId(expense._id);
    setEditMode(true);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-yellow-400">
      <h1 className="text-4xl font-bold mb-4">Expense Tracker</h1>
      <form className="mb-6" onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Description"
          className="p-2 rounded-md border-2 border-yellow-400 mr-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="p-2 rounded-md border-2 border-yellow-400 mr-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" className="bg-yellow-400 text-gray-900 font-bold p-2 rounded-md">
          {editMode ? 'Update' : 'Add'} Expense
        </button>
      </form>
      <ul className="w-full max-w-md bg-gray-800 p-4 rounded-md">
        {expenses.map((expense) => (
          <li key={expense._id} className="flex justify-between items-center mb-2 p-2 border-b-2 border-gray-600">
            <span>{expense.description} - ${expense.amount}</span>
            <div>
              <button className="text-red-400 mr-2" onClick={() => editExpense(expense)}>Edit</button>
              <button className="text-red-400" onClick={() => deleteExpense(expense._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
