import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MDBox from '../../components/MDBox';
// import MDButton from '../../components/MDButton';

import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';


const FileUploader = ({Render}) => {
  const [file, setFile] = useState(null);
  console.log("Render", Render)

  let render;
  let setRender;
  if(Render){
    render = Render.render
    setRender = Render.setRender
  }
  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    
    try {
      
      const formData = new FormData();

      for (let i = 0; i < file.length; i++) {
        formData.append("file", file[i]);
      }
      // formData.append('file', file);
      
      console.log(formData, file, file.name)
      const { data } = await axios.post(`${baseUrl}api/v1/uploads`, formData, 
      
      {
        withCredentials: true,
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
    render ? setRender(false) : setRender(true);
  };

  return (
    <>
      <MDBox mt={0.5} display="flex" alignItems="center">
        <TextField
          id="filled-basic"
          label="Uploaad File" 
          variant="filled" 
          type="file" 
          multiple
          onChange={handleFileChange}
          sx={{margin: 1, padding: 1, width: "250px"}}
        />  

        {/* <input
        id="filled-basic"
        label="Uploaad File" 
        variant="filled" 
        sx={{margin: 1, padding: 1, width: "250px"}}
         type="file" multiple onChange={handleFileChange} />  */}

        <Button onClick={handleUpload} autoFocus backGround="red">
          Upload
        </Button>
      </MDBox>
    </>
  );
};

export default FileUploader;