import * as React from 'react';
import Button from '@mui/material/Button';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import axios from "axios";
import {useState, useContext} from "react"
import { userContext } from '../../AuthContext';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';



const RolesModel = ({setCreate}) => {
  const [formstate, setformstate] = useState({
    roleName: "",
    reportAccess: "",
    userAccess: "",
    attributesAccess: "",
    analyticsAccess: "",
    status: ""
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const getDetails = useContext(userContext);

  const [reRender, setReRender] = useState(true);



  const handleClose = () => {
    setCreate(false);
  };


  async function formSubmit() {
    setformstate(formstate);
    console.log(formstate)

    const { roleName, reportAccess, userAccess, attributesAccess, analyticsAccess, status } = formstate;

    const res = await axios.post(`${baseUrl}api/v1/roles`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        roleName, reportAccess, userAccess, attributesAccess, analyticsAccess, status

      })
    })
           
    const data = res.data;
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        console.log("Invalid Entry");
    }else{
        window.alert("Role Created Successfully");
        console.log("entry succesfull");
    }
    setCreate(false);
    // reRender ? setReRender(false) : setReRender(true)

  }


  return (
    <div>
      <TextField
        id="outlined-basic" label="Role Name" variant="standard"
        sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.roleName = e.target.value}} />

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Report Access</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Report Access"
          sx={{ margin: 1, padding: 1, width: "300px" }}
          onChange={(e)=>{formstate.reportAccess = e.target.value}}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">User Access</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="User Access"
          sx={{ margin: 1, padding: 1, width: "300px" }}
          onChange={(e)=>{formstate.userAccess = e.target.value}}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Attributes Access</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Attributes Access"
          sx={{ margin: 1, padding: 1, width: "300px" }}
          onChange={(e)=>{formstate.attributesAccess = e.target.value}}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Analytics Access</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Analytics Access"
          sx={{ margin: 1, padding: 1, width: "300px" }}
          onChange={(e)=>{formstate.analyticsAccess = e.target.value}}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Status"
          sx={{ margin: 1, padding: 1, width: "300px" }}
          onChange={(e)=>{formstate.status = e.target.value}}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <Button autoFocus onClick={formSubmit}>
        Save
      </Button>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>
    </div>
  );
}

export default RolesModel;