import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(formData, file, file.name)
      const { data } = await axios.post(`${baseUrl}api/v1/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully');
      console.log(data);
    } catch (error) {
      console.log(error);
      alert('File upload failed');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUploader;