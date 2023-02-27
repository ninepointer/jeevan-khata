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





const UserModel = ({activeUsers, id, Render, setView}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [roleDetail, setRoleDetail] = useState([]);


  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/roles`)
    .then((res)=>{
      setRoleDetail(res.data.data)
      console.log("res.data.data", res.data.data)
    })
    .catch(()=>{
      console.log("Fail to fetch data")
    })
  },[])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setView(false);
  };

  const gender = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ];


let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
let permissionId = useRef(0);
let date = new Date();
let lastModified = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

const {reRender, setReRender} = Render;
const[editData, setEditData] = useState(activeUsers);

const [FirstName, setFirstName] = useState();
const [LastName, setLastName] = useState();
const [Email, setEmail] = useState();
const [Mobile, setMobile] = useState();
const [Gender, setGender] = useState();
const [dob, setdob] = useState();
const [City, setCity] = useState();
const [State, setState] = useState();
const [Aadhaar, setAadhaar] = useState();
const [Password, setPassword] = useState();
const [Role, setRole] = useState();
const [Address, setAddress] = useState();

    useEffect(()=>{

        let updatedData = activeUsers.filter((elem)=>{
            return elem._id === id
        })
        setEditData(updatedData)

    },[reRender])

    useEffect(()=>{
        console.log("edit data", editData);

        setFirstName(editData[0].firstName)
        setLastName(editData[0].lastName)
        setEmail(editData[0].email)
        setMobile(editData[0].mobile)
        setGender(editData[0].gender)
        
        setCity(editData[0].city)
        setState(editData[0].state)
        setAadhaar(editData[0].aadhaarCardNumber)
        setAddress(editData[0].address)
        setRole(editData[0].role)

        const dobdate = (editData[0].dateOfBirth).split("T");
        setdob(dobdate[0])


    }, [editData, reRender])



    const [formstate, setformstate] = useState({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      gender: "",
      dateOfBirth: "",
      city: "",
      state: "",
      aadhaarCardNumber: "",
      role: "",
      password: "",
      address: ""
    });


async function onSave() {

  formstate.firstName = FirstName
  formstate.lastName = LastName
  formstate.email = Email
  formstate.mobile = Mobile
  formstate.gender = Gender
  formstate.dateOfBirth = dob
  formstate.city = City
  formstate.state = State
  formstate.aadhaarCardNumber = Aadhaar
  formstate.address = Address
  formstate.password = Password

  if(!formstate.role){
    console.log("in if")
    roleDetail.map((elem)=>{
      console.log(elem, Role)
      if(elem.roleName === Role.roleName){
        formstate.role = elem._id
      }
    })
  }

    setformstate(formstate);
    console.log(formstate)
    const {firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, role, address} = formstate;

    const res = await fetch(`${baseUrl}api/v1/users/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
          firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, role, address
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
  const res = await fetch(`${baseUrl}api/v1/users/${id}`, {
      method: "DELETE",
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

  function settingRole(e){
    roleDetail.map((elem)=>{
      if(elem.roleName === e.target.value){
        setRole(e.target.value);
        formstate.role = elem._id
      }
    })
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


        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding: 1, width: "250px" },
          }}
          noValidate
          autoComplete="off"
        >
        <TextField
          id="filled-basic" label="First Name" variant="filled" disabled={editOn} value={FirstName}
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{ setFirstName( e.target.value)}}
          />

        <TextField
          id="filled-basic" label="Last Name" variant="filled" disabled={editOn} value={LastName}
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{ setLastName( e.target.value)}}/>
        

        <TextField
          id="filled-basic" label="Email ID" variant="filled" disabled={editOn} value={Email}
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{ setEmail( e.target.value)}}/>

        
        <TextField
          id="filled-basic" label="Mobile No." variant="filled" disabled={editOn} value={Mobile}
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{ setMobile( e.target.value)}}/>
        
        <TextField
          id="filled-basic"
          select
          label="Gender"
          defaultValue=""
          helperText="Please select your gender"
          variant="filled" 
          disabled={editOn} 
          value={Gender !== undefined && Gender}
          sx={{margin: 4, padding: 2, width: "200px"}}
          onChange={(e)=>{ setGender( e.target.value)}}
        >
          {gender.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>


        <TextField
          id="filled-basic" label="Date of Birth" variant="filled" disabled={editOn} value={dob !== undefined && dob} type="date"
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{ setdob( e.target.value)}}/>
        
        <TextField
          id="filled-basic" label="City" variant="filled" disabled={editOn} value={City} 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{ setCity( e.target.value)}}/>

        <TextField
          id="filled-basic" label="State" variant="filled" disabled={editOn} value={State} 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{ setState( e.target.value)}}/>
        
        <TextField
          id="filled-basic" label="Aadhaar Card Number" variant="filled" disabled={editOn} value={Aadhaar} type="number"
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{ setAadhaar( e.target.value)}}/>

        <TextField
          id="filled-basic" label="Password" variant="filled" disabled={editOn} 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{ setPassword( e.target.value)}}/>

        <TextField
          id="filled-basic"
          select
          label="Role"
          defaultValue=""
          helperText="Please select role"
          variant="filled" disabled={editOn}
          value={Role !== undefined && (Role.roleName ? Role?.roleName : Role)}
          sx={{margin: 4, padding: 2, width: "200px"}}
          onChange={(e)=>{ settingRole(e)}}
        >
          {roleDetail.map((option) => (
            <MenuItem key={option.roleName} value={option.roleName}>
              {option.roleName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="filled-basic" label="Address" variant="filled" disabled={editOn} value={Address} 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{ setAddress( e.target.value)}}/>


      </Box>

    </div>
  );
}

export default UserModel;