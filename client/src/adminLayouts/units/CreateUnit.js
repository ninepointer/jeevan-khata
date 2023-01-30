import * as React from 'react';
import {useContext, useState, useEffect} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import uniqid from "uniqid";
import CreateUnitTableData from "./CreateUnitTableData"
import DataTable from "../../layoutComponents/Tables/DataTable";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import axios from "axios";

  const CreateUnit = ({setCreateUnit}) => {

    const {columns, rows} = CreateUnitTableData();
    const [row, setRow] = useState([]);


    let [formData, setFormData] = useState({
      unitFullName: "",
      unitId: "",
      status: "",
      unitConversionData: []
    });



    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    const [render, setRender] = useState(true);
    const [bioMarkerArr, setBioMarkers] = useState([]);

    useEffect(()=>{
      axios.get(`${baseUrl}api/v1/bioMarkers`)
      .then((res)=>{
        setBioMarkers(res.data.data)
        console.log("res.data.data", res.data.data)
      })
      .catch(()=>{
        console.log("Fail to fetch data")
      })
    },[])

    // console.log(bioMarkers)
  
    const handleClose = () => {
      setCreateUnit(false);
    };

    // data sent to backend function
    async function formSubmit(){

      setFormData(formData);
      console.log(formData)
      const { unitFullName, unitId, status, unitConversionData } = formData;

      const res = await fetch(`${baseUrl}api/v1/units`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          unitFullName, unitId,  unitConversion: unitConversionData
        })
    });
    
    const data = await res.json();
             
      console.log(data);
      if(data.status === 422 || data.error || !data){ 
          window.alert(data.error);
          console.log("Invalid Entry");
      }else{
          window.alert("Unit Created Successfully");
          console.log("entry succesfull");
      }

      setCreateUnit(false);
    }
    
    function deleteItem(id){
      let update = row.filter((elem)=>{
        console.log(elem.id.props.children , id)
        return elem.id.props.children !== id;
      })
      setRow(update);
    }

    function onCreate(){
      let obj = {};

      let unitConversionData = {
      unitConversionFullName: "",
      unitConversionId: "",
      value: "",
      bioMarkers: ""
      };


      obj.id = (
        <MDTypography component="a" variant="caption">
          {Date.now()}
        </MDTypography>
      );

      obj.delete = (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(e)=>{deleteItem(obj.id.props.children)}}>
          🗑️
        </MDButton>
      );

      obj.cunitfullname = (
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{unitConversionData.unitConversionFullName = e.target.value}}/>
        );

      obj.cunitid = ( 
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{unitConversionData.unitConversionId = e.target.value}}/>
        );

      obj.value = (
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"150px"}} onChange={(e)=>{unitConversionData.value = e.target.value}}/>
        );

        obj.bioMarkers = (
          <TextField
            id="filled-basic"
            select
            label=""
            defaultValue=""
            helperText="Please select bio marker"
            variant="filled"
            sx={{margin: 1, padding: 1, width: "150px"}}
            onChange={(e)=>{unitConversionData.bioMarkers = e.target.value}}
          >
            {bioMarkerArr.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          );

      setRow((oldState)=> [...oldState, obj])
      formData.unitConversionData.push(unitConversionData);
      render ? setRender(false):setRender(true)
    }


    console.log(formData)
  
    return ( 
      <>
        <MDBox pt={3} pb={3}>
        <MDTypography variant="h6" fontWeight="medium" borderRadius="10px" color="white" backgroundColor="#afb0b2" marginLeft="15px">
          &nbsp;&nbsp;Create Unit
        </MDTypography>
        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding : 1, width:"200px"  },
            }}
            noValidate
            autoComplete="off"
          >
        <TextField
        id="filled-basic" label="Unit Name" variant="filled"
          sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{formData.unitFullName = e.target.value}}/>
        
        <TextField
        id="filled-basic" label="Unit Id" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.unitId = e.target.value}}/>

        <MDBox pt={3} pb={3}>
          <Grid container spacing={6}>
              <Grid item xs={12} md={12} lg={12}>
                  <Card>
                      <MDBox
                          mx={2}
                          mt={-3}
                          py={1}
                          px={2}
                          variant="gradient"
                          bgColor="info"
                          borderRadius="lg"
                          coloredShadow="info"
                          sx={{
                              display: 'flex',
                              justifyContent: "space-between",
                          }}>

                          <MDTypography variant="h6" color="white" py={1}>
                            Add Unit Conversion
                          </MDTypography>

                          <MDButton variant="outlined" color="white" onClick={onCreate}>
                            Add
                          </MDButton>
                      </MDBox>
                      <MDBox pt={2}>
                          <DataTable
                              table={{ columns, rows: row }}
                              isSorted={false}
                              entriesPerPage={false}
                              showTotalEntries={false}
                              noEndBorder
                          />
                      </MDBox>
                  </Card>
              </Grid>
          </Grid>
    
        </MDBox>

        <MDBox mt={1} ml={2} display="flex" alignItems="center">
          <MDBox component="span" variant="button" fontWeight="dark" fontSize="15px" color="text">Status</MDBox><Switch label="Status"  onChange={(e) => {formData.status = e.target.value}} />
        </MDBox>
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

export default CreateUnit