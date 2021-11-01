import React, { useState, useRef } from 'react';
import axios from 'axios';
import { CSVReader } from 'react-papaparse';
import './App.css';

function App() {
  // const buttonRef = React.createRef();
  const buttonRef = useRef(null);
  const [contacts, setContacts] = useState([]);

  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    const formattedContacts = data.map((d) => {
      const [to, body] = d.data;
      return { to, body };
    });
    setContacts(formattedContacts);
  };

  const handleSendSMS = async () => {
    console.log(contacts);
    const res = await axios.post(
      'https://mmarshall.eu.ngrok.io/sendBulk',
      contacts
    );
    console.log(res);
  };

  return (
    <div className="form-container">
      <div className="form-container-inner">
        <h1>Broadcast Tool</h1>
        <h2>Bulk SMS Sender</h2>
        <CSVReader ref={buttonRef} onFileLoad={handleOnFileLoad} noClick noDrag>
          {({ file }) => (
            <aside className="csv-reader-aside">
              <button
                type="button"
                onClick={handleOpenDialog}
                className="csv-reader-button"
              >
                Upload CSV
              </button>
              <div className="csv-reader-file">{file && file.name}</div>
            </aside>
          )}
        </CSVReader>
        <button className="sms-submit-button" onClick={handleSendSMS}>
          Send SMS Campaign ✅
        </button>
      </div>
    </div>
  );
}

export default App;
