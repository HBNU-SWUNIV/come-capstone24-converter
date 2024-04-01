import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios'; 

function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }
  const handleFileUpload = async () => {
    try{
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('/upload', formData);
      console.log('File uploaded successfully!');
    }catch(error){
      console.error('File uploaded failed:', error);
    }
  };

   return (
    <div className="App">
      <header className="App-header">
        {/* 파일 선택 input */}
        <input type="file" onChange={handleFileChange}/>

        {/* 파일 업로드 버튼 */}
        <button onClick={handleFileUpload}>Upload File</button>

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
