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
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import MDBox from "../../components/MDBox";
import Switch from "@mui/material/Switch";







const EditLabTest = ({labTestData, id, Render, setView}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [bioMarker, setBioMarker] = React.useState([]);



  const handleClose = () => {
    setView(false);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setBioMarkers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );

    // console.log(personName)
  };


  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/bioMarkers/bioMarkerName`)
    .then((res)=>{
      setBioMarker(res.data.data)
      console.log("res.data.data", res.data.data)
    })
    .catch(()=>{
      console.log("Fail to fetch data")
    })
  },[])
  let names = [];
  bioMarker.map((elem)=>{
    names.push(elem.name)
  })
  
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
let permissionId = useRef(0);
let date = new Date();
let lastModified = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

const {reRender, setReRender} = Render;
const[editData, setEditData] = useState(labTestData);

const [TestName, setTestName] = useState();
const [TestScientificName, setTestScientificName] = useState();
const [BioMarkers, setBioMarkers] = useState([]);
const [Status, setStatus] = useState();


useEffect(()=>{
  let updatedData = labTestData.filter((elem)=>{
      return elem._id === id
  })
  setEditData(updatedData);
  if(updatedData.length){
    setTestName(updatedData[0].testName);
    setTestScientificName(updatedData[0].testScientificName);
    setBioMarkers(updatedData[0].bioMarkers);
    setStatus(updatedData[0].status);
  }
},[labTestData, id])

const [formstate, setformstate] = useState({
    testName: "",
    testScientificName: "",
    bioMarkers: [],
    status: ""
  });

// console.log(formstate);


async function onSave() {

  
  formstate.testName = TestName
  formstate.testScientificName = TestScientificName
  formstate.bioMarkers = BioMarkers
  formstate.status = Status

    setformstate(formstate);
    console.log(formstate)

    const {testName, testScientificName, bioMarkers, status} = formstate;


    const res = await fetch(`${baseUrl}api/v1/labTests/update/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            testName, testScientificName, bioMarkers, status
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
  const res = await fetch(`${baseUrl}api/v1/labTests/delete/${id}`, {
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


      <TextField
        id="outlined-basic" label="Test Name" variant="standard"
        sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} value={TestName} onChange={(e)=>{ setTestName(e.target.value)}} />

      <TextField
        id="outlined-basic" label="Scientific Name" variant="standard"
        sx={{ margin: 1, padding: 1, width: "300px" }} disabled={editOn} value={TestScientificName} onChange={(e)=>{ setTestScientificName(e.target.value)}} />


        <FormControl sx={{ m: 2, width: 300, minHeight: 100 }}>
          <InputLabel id="filled-basic">Bio Markers</InputLabel>
          <Select
            labelId="filled-basic"
            id="filled-basic"
            multiple
            disabled={editOn} 
            value={BioMarkers}
            onChange={handleChange}
            input={<OutlinedInput id="filled-basic" label="Bio Markers" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight:100, height:100 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        
        <MDBox mt={0.5} display="flex" alignItems="center">
          <MDBox component="span" variant="button" fontWeight="light" fontSize="15px" color="text">Status</MDBox>
          <Switch checked={Status === "Active"} label="Status"  value={Status} disabled={editOn} onClick={() => setStatus(prevStatus => prevStatus === "Active" ? "Inactive" : "Active" )}  />
        </MDBox>

    </div>
  );
}

export default EditLabTest;