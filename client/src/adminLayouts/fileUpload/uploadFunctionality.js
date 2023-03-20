import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import MDBox from '../../components/MDBox';

import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';
import { userContext } from '../../AuthContext';



const FileUploader = ({Render}) => {
  const [file, setFile] = useState(null);
  const getDetails = useContext(userContext);
  console.log(getDetails)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"

  const [familyMembers, setFamilyMember] = useState([]);
  const initialName = `${getDetails.userDetails.firstName} ${getDetails.userDetails.lastName}`
  const [selectedMember, setSelectedMember] = useState(initialName);

  console.log("initialName", initialName, selectedMember)
  let render;
  let setRender;
  if(Render){
    render = Render.render
    setRender = Render.setRender
  }

  async function apiCall(){
    const res = await fetch(`${baseUrl}api/v1/users/familyTree`, {
      method: "GET",
      credentials:"include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      },
    )
    let data = await res.json();
    let obj1 = {
      data: {
        firstName: getDetails.userDetails.firstName,
        lastName: getDetails.userDetails.lastName
      }
    }

    data.data.push(obj1)
    setFamilyMember(data.data);
    console.log(data.data)


  }

  useEffect(()=>{

    apiCall()

  }, [])

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };


  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
  
    try {
      let selectedMemberObj;
      let filtering = familyMembers.filter((elem) => {
        return selectedMember === `${elem.data.firstName} ${elem.data.lastName}`
      });
      if (filtering.length > 0) {
        selectedMemberObj = filtering[0];
      } else {
        selectedMemberObj = getDetails.userDetails;
      }

      console.log("selectedMemberObj", selectedMemberObj, filtering, getDetails.userDetails)
  
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append("file", file[i]);
      }
      formData.append("selectedMemberName", selectedMember);
      formData.append("selectedMemberGender", selectedMemberObj.data.gender);
      formData.append("selectedMemberId", selectedMemberObj.data._id);
  
      console.log(formData, file, file.name)
      const { data } = await axios.post(`${baseUrl}api/v1/uploads`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
  
      console.log("if file uploaded before", data);
      alert(data.message);
      console.log("if file uploaded", data);
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
          label="Upload File" 
          variant="filled" 
          type="file" 
          multiple
          onChange={handleFileChange}
          sx={{margin: 1, padding: 1, width: "250px"}}
        />  

        <TextField
          id="filled-basic"
          select
          label="Family Member"
          defaultValue=""
          helperText="Select Family Member"
          variant="filled"
          sx={{margin: 4, padding: 2, width: "200px"}}
          onChange={(e)=>{setSelectedMember(e.target.value)}}
          value={selectedMember}
        >
          {familyMembers.map((option) => (
            option.data.firstName &&
            <MenuItem key={option.data.firstName+" "+ option.data.lastName} value={option.data.firstName+" "+ option.data.lastName}>
              {option.data.firstName +" "+ option.data.lastName}
            </MenuItem>
            
          ))}
        </TextField>


        <Button onClick={handleUpload} autoFocus backGround="red">
          Upload
        </Button>
      </MDBox>
    </>
  );
};

export default FileUploader;