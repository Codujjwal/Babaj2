import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleJsonInput = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput); // Validate JSON
      if (!parsedJson.data) throw new Error("JSON must contain 'data' field");
      
      const res = await axios.post('http://localhost:5000/bfhl', parsedJson);
      setResponse(res.data);
      setDropdownVisible(true);
      setError('');
    } catch (err) {
      setError('Invalid JSON format or server error');
      setDropdownVisible(false);
      setResponse(null);
    }
  };

  const handleDropdownChange = (e) => {
    setSelectedOptions([...e.target.selectedOptions].map(option => option.value));
  };

  const renderResponse = () => {
    if (!response) return null;
    const { alphabets, numbers, highest_lowercase_alphabet } = response;
    return (
      <div>
        {selectedOptions.includes('Alphabets') && <p>Alphabets: {alphabets.join(', ')}</p>}
        {selectedOptions.includes('Numbers') && <p>Numbers: {numbers.join(', ')}</p>}
        {selectedOptions.includes('Highest lowercase alphabet') && (
          <p>Highest lowercase alphabet: {highest_lowercase_alphabet.join(', ')}</p>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Roll Number: ABCD123</h1>
      <textarea
        rows="5"
        cols="50"
        value={jsonInput}
        onChange={handleJsonInput}
        placeholder='Enter JSON here (e.g., {"data": ["A","C","z"]})'
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}

      {dropdownVisible && (
        <div>
          <label>Select Response Data to Display:</label>
          <select multiple={true} onChange={handleDropdownChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      <div className="response">
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;
