import * as React from 'react';
import {useContext, useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import uniqid from "uniqid";


// const CreateBioMarker = ({Render}) => {
  const CreateBioMarker = ({checkIsCreate}) => {
    // const {reRender, setReRender} = Render
    let uId = uniqid();
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let createdBy = "prateek";
    let isDeleted = false;
    let lastModifiedBy = createdBy;
    let lastModifiedOn = createdOn

    let [formData, setFormData] = useState({
      name: "",
      unit: "",
      gender: "",
      ageGroupStartRange: "",
      ageGroupEndRange: "",
      ageGroupUnit: "",
      range: "",
      bodyCondition: "",
      status: ""
    });

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
      

    // console.log(getDetails)
    // let createdBy = getDetails.userDetails.name

  
    const handleClose = () => {
      checkIsCreate(false);
    };

    // data sent to backend function
    async function formSubmit(){

      setFormData(formData);
      console.log(formData)
      const { name, unit, gender, ageGroupStartRange, ageGroupEndRange, ageGroupUnit, range, bodyCondition, status } = formData;

      const res = await fetch(`${baseUrl}api/v1/instrument`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            name, unit, gender, ageGroupStartRange, ageGroupEndRange, ageGroupUnit, range, bodyCondition, status, uId, lastModifiedOn, lastModifiedBy, isDeleted, createdBy, createdOn
          })
      });

      const data = await res.json();
      console.log(data);
      if (data.status === 422 || data.error || !data) {
          window.alert(data.error);
      } else {
          // window.alert("Bio Marker Created Succesfully");
          console.log("entry succesfull");
      }
      // reRender ? setReRender(false) : setReRender(true)
      checkIsCreate(false);
    }
  
    return (
      <div>
        <TextField
        id="outlined-basic" label="Name" variant="standard"
          sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.name = e.target.value}}/>
        
        <TextField
        id="outlined-basic" label="Unit" variant="standard"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.unit = e.target.value}}/>
        
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Gender"
              sx={{margin: 1, padding : 1, width:"300px"}}
              onChange={(e)=>{formData.gender = e.target.value}}
              >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
        </FormControl>

        <TextField
        id="outlined-basic" label="Age Group Start Range" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.ageGroupStartRange = e.target.value}}/>
        
        <TextField
        id="outlined-basic" label="Age Group End Range" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.ageGroupEndRange = e.target.value}}/>
        
        <TextField
        id="outlined-basic" label="Age Group Unit" variant="standard" 
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.ageGroupUnit = e.target.value}}/>
        
        <TextField
        id="outlined-basic" label="Max Lot" variant="standard" 
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.range = e.target.value}}/>

        <TextField
        id="outlined-basic" label="Body Condition" variant="standard" 
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.bodyCondition = e.target.value}}/>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Status"
              sx={{margin: 1, padding : 1, width:"300px"}}
              onChange={(e)=>{formData.status = e.target.value}}
              >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
        </FormControl>

        <Button autoFocus onClick={formSubmit}>
          OK
        </Button>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </div>
    );
  }

export default CreateBioMarker