import * as React from 'react';
import Button from '@mui/material/Button';
import MDBox from '../../components/MDBox';
import MDTypography from '../../components/MDTypography';
import Box from '@mui/material/Box';
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
import { userContext } from '../../AuthContext';
import {useState, useContext} from "react"
import axios from "axios"
import { textAlign } from '@mui/system';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';



const CreateLabTest = ({setCreateLabTest}) => {

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [formstate, setformstate] = useState({
    testName: "",
    testScientificName: "",
    bioMarkers: [

    ],
  });

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
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );

    console.log(personName)
  };
  const names = [
    'BM1',
    'BM2',
    'BM3',
    'BM4',
    'BM5',
    'BM6',
    'BM7',
    'BM8',
    'BM9',
    'BM10',
  ];

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const getDetails = useContext(userContext);

  const [reRender, setReRender] = useState(true);



  const handleClose = () => {
    setCreateLabTest(false);
  };


  async function formSubmit() {
    formstate.bioMarkers = personName;
    setformstate(formstate);
    console.log(formstate)

    const { testName , testScientificName , bioMarkers} = formstate;
    const res = await fetch(`${baseUrl}api/v1/labTests`, {
      method: "POST",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        testName , testScientificName , bioMarkers
      })
    });
  
  const data = await res.json();
           
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        //console.log("Invalid Entry");
    }else{
        window.alert("Lab Test Created Successfully");
        //console.log("entry succesfull");
    }
    setCreateLabTest(false);
    // reRender ? setReRender(false) : setReRender(true)

}

  return (
    <>
        <MDBox pt={3} pb={3}>
        <MDTypography variant="h6" fontWeight="medium" borderRadius="10px" color="white" backgroundColor="#afb0b2" marginLeft="15px">
          &nbsp;&nbsp;Create Lab Test
        </MDTypography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '15ch',margin: 1, padding: 1, minWidth: '15ch' },
          }}
          noValidate
          autoComplete="off"
        >
        <TextField
          id="filled-basic" label="Test Name" variant="filled"
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{formstate.testName = e.target.value}}
          />

        <TextField
          id="filled-basic" label="Scientific Name" variant="filled"
          sx={{margin: 1, padding: 1, width: "250px", minHeight: "50px"}} onChange={(e)=>{formstate.testScientificName = e.target.value}}/>

        <FormControl sx={{ m: 2, width: 300, minHeight: 100 }}>
          <InputLabel id="filled-basic">Bio Markers</InputLabel>
          <Select
            labelId="filled-basic"
            id="filled-basic"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="filled-basic" label="Bio Markers" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight:50, height:65 }}>
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
        

        </Box>
      <Button autoFocus onClick={formSubmit}>
        Save
      </Button>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>
      </MDBox>

    </>
  );
}

export default CreateLabTest;