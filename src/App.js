import React, { useState } from 'react';
import './App.css';

function App() {
  const [simNumber, setSimNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('inactive'); 
  const [activationDate, setActivationDate] = useState('');
  const [message, setMessage] = useState('');
  const [simDetails, setSimDetails] = useState(null); 

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const registerSimCard = async () => {
    try {
      const response = await fetch('http://localhost:5000/register-sim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sim_number: simNumber,
          phone_number: phoneNumber,
          status: 'inactive', 
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage(`SIM Card registered successfully: ${JSON.stringify(data)}`);
      } else {
        setMessage(`Error: ${data.error || 'An error occurred'}`);
      }
    } catch (error) {
      setMessage('Error registering SIM card');
      console.error('Error:', error);
    }
  };
  
  const activateSimCard = async () => {
    try {
      const response = await fetch('http://localhost:5000/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sim_number: simNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setActivationDate(new Date().toLocaleString()); 
        setMessage(`SIM Card activated successfully: ${JSON.stringify(data)}`);
      } else {
        setMessage(`Error: ${data.error || 'An error occurred'}`);
      }
    } catch (error) {
      setMessage('Error activating SIM card');
      console.error('Error:', error);
    }
  };

  const deactivateSimCard = async () => {
    try {
      const response = await fetch('http://localhost:5000/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sim_number: simNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setActivationDate(''); 
        setStatus('inactive'); 
        setMessage(`SIM Card deactivated successfully: ${JSON.stringify(data)}`);
      } else {
        setMessage(`Error: ${data.error || 'An error occurred'}`);
      }
    } catch (error) {
      setMessage('Error deactivating SIM card');
      console.error('Error:', error);
    }
  };


  const fetchSimDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/sim-details/${simNumber}`);
      const data = await response.json();
      if (response.ok) {
        setSimDetails(data); 
        setMessage(`Fetched SIM details successfully: ${JSON.stringify(data)}`);
      } else {
        setMessage(`Error: ${data.error || 'An error occurred'}`);
      }
    } catch (error) {
      setMessage('Error fetching SIM details');
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h2>SIM Card Management</h2>
      <div>
        <label htmlFor="simNumber">SIM Number:</label>
        <input 
          type='number' 
          id="simNumber" 
          value={simNumber} 
          onChange={(e) => handleInputChange(e, setSimNumber)} 
          required 
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input 
          type='number' 
          id="phoneNumber" 
          value={phoneNumber} 
          onChange={(e) => handleInputChange(e, setPhoneNumber)} 
          required 
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select 
          id="status" 
          value={status} 
          onChange={(e) => handleInputChange(e, setStatus)} 
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label htmlFor="activationDate">Activation Date:</label>
        <input 
          type='text' 
          id="activationDate" 
          value={activationDate} 
          onChange={(e) => handleInputChange(e, setActivationDate)} 
          placeholder="Enter activation date" 
        />
      </div>
      <button onClick={registerSimCard}>Register SIM</button>
      <button onClick={activateSimCard}>Activate</button>
      <button onClick={deactivateSimCard}>Deactivate</button>
      <button onClick={fetchSimDetails}>Get Details</button> 
      
      {message && <p>{message}</p>}

      {simDetails && (
        <div>
          <h3>SIM Details:</h3>
          <p><strong>SIM Number:</strong> {simDetails.sim_number}</p>
          <p><strong>Phone Number:</strong> {simDetails.phone_number}</p>
          <p><strong>Status:</strong> {simDetails.status}</p>
          <p><strong>Activation Date:</strong> {simDetails.activation_date ? new Date(simDetails.activation_date).toLocaleString() : 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
