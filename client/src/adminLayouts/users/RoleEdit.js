import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {useState, useRef, useEffect} from "react"
import EditSharpIcon from '@mui/icons-material/EditSharp';
import axios from "axios";
import Box from '@mui/material/Box';





const RoleEdit = ({roleData, id, Render, setView}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();


  const handleClose = () => {
    setView(false);
  };


let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
let permissionId = useRef(0);
let date = new Date();
let lastModified = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

const {reRender, setReRender} = Render;
const[editData, setEditData] = useState(roleData);

const [RoleName, setRoleName] = useState();
const [ReportAccess, setReportAccess] = useState();
const [UserAccess, setUserAccess] = useState();
const [AttributesAccess, setAttributesAccess] = useState();
const [AnalyticsAccess, setAnalyticsAccess] = useState();
const [Status, setStatus] = useState();


useEffect(()=>{
  let updatedData = roleData.filter((elem)=>{
      return elem._id === id
  })
  setEditData(updatedData);
  if(updatedData.length){
    setRoleName(updatedData[0].roleName);
    setReportAccess(updatedData[0].reportAccess);
    setUserAccess(updatedData[0].userAccess);
    setAttributesAccess(updatedData[0].attributesAccess);
    setAnalyticsAccess(updatedData[0].analyticsAccess);
    setStatus(updatedData[0].status);
  }
},[roleData, id])

const [formstate, setformstate] = useState({
  roleName: "",
  reportAccess: "",
  userAccess: "",
  attributesAccess: "",
  analyticsAccess: "",
  status: ""
});

// console.log(formstate);


async function onSave() {

  formstate.roleName = RoleName
  formstate.reportAccess = ReportAccess
  formstate.userAccess = UserAccess
  formstate.attributesAccess = AttributesAccess
  formstate.analyticsAccess = AnalyticsAccess
  formstate.status = Status

    setformstate(formstate);
    const {roleName, reportAccess, userAccess, attributesAccess, analyticsAccess, status} = formstate;


    const res = await fetch(`${baseUrl}api/v1/roles/update/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
          roleName, reportAccess, userAccess, attributesAccess, analyticsAccess, status
        })
    });


    const dataResp = await res.json();
    
    console.log(dataResp);
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        window.alert(dataResp.error);
        console.log("Failed to Edit");
    }else {
        console.log(dataResp);
        window.alert("Edit succesfull");
        console.log("Edit succesfull");
    }

    setEditOn(true);
    setView(false);
    reRender ? setReRender(false) : setReRender(true)
}

async function Ondelete(){
  console.log(editData)
  const res = await fetch(`${baseUrl}api/v1/roles/delete/${id}`, {
      method: "PATCH",
  });


  const dataResp = await res.json();
  
  console.log(dataResp);
  if (dataResp.status === 422 || dataResp.error || !dataResp) {
      window.alert(dataResp.error);
      console.log("Failed to Delete");
  } else {
      console.log(dataResp);
      window.alert("Delete succesfull");
      console.log("Delete succesfull");
  }
  setView(false);
  reRender ? setReRender(false) : setReRender(true)
}

  const [editOn, setEditOn] = useState(true);
  function onEdit(){
    setEditOn(false);
  }


  return (
    <div>
      {editOn ?
      <Button autoFocus onClick={onEdit}>
        Edit
      </Button>
      :
      <Button autoFocus onClick={onSave}>
      Save
      </Button>}
      <Button onClick={Ondelete} autoFocus>
        Delete
      </Button>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>


      {console.log(Status, RoleName, ReportAccess)}
      <TextField
        id="outlined-basic" label="Role Name" variant="standard"
        sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} value={RoleName} onChange={(e)=>{ setRoleName(e.target.value)}} />

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Report Access</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Report Access"
          sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} 
          
          onChange={(e)=>{ setReportAccess(e.target.value)}}
          value={ReportAccess !== undefined && ReportAccess}
          // value="true"
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
          sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} 
          value={UserAccess !== undefined && UserAccess}
          onChange={(e)=>{ setUserAccess(e.target.value)}}
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
          sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} 
          value={AttributesAccess !== undefined && AttributesAccess}
          onChange={(e)=>{ setAttributesAccess(e.target.value)}}
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
          sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} 
          value={AnalyticsAccess !== undefined && AnalyticsAccess}
          onChange={(e)=>{ setAnalyticsAccess(e.target.value)}}
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
          sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} 
          value={Status !== undefined && Status}
          onChange={(e)=>{ setStatus(e.target.value)}}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

    </div>
  );
}

export default RoleEdit;