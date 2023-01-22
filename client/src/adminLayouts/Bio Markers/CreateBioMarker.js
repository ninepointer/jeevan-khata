import * as React from 'react';
import {useContext, useState, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import uniqid from "uniqid";
import CreateBioMarkerTableData from "./CreateBioMarkerTableData"
import DataTable from "../../layoutComponents/Tables/DataTable";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";





  const CreateBioMarker = ({setCreateBio}) => {

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

    const ageunit = [
      {
        value: 'Weeks',
        label: 'Weeks',
      },
      {
        value: 'Months',
        label: 'Months',
      },
      {
        value: 'Years',
        label: 'Years',
      },
    ];

    const bodycondition = [
      {
        value: 'On Period',
        label: 'On Period',
      },
      {
        value: 'Pregnency',
        label: 'Pregency',
      },

    ];

    let bioMarkerTypeDataFirst = {
      gender: "",
      ageGroupStartRange: "",
      ageGroupEndRange: "",
      ageGroupUnit: "",
      range: "",
      bodyCondition: "",
    };
    let obj = {
      id : (
        <MDTypography component="a" href="#" variant="caption">
          {"0001"}
        </MDTypography>
      ),
      delete : (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(id)=>{deleteItem("0001")}}>
          🗑️
        </MDButton>
      ),
      gender : (
        <TextField
          id="filled-basic"
          select
          label=""
          defaultValue=""
          //helperText="Please select your gender"
          variant="filled"
          sx={{margin: 1, padding: 1, width: "100px"}}
          onChange={(e)=>{bioMarkerTypeDataFirst.gender = e.target.value}}
        >
          {gender.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ),
  
      agegroupstart : ( 
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupStartRange = e.target.value}}/>
        ),
  
      agegroupend : (
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupEndRange = e.target.value}}/>
      ),
        
      agegroupunit : (
        <TextField
          id="filled-basic"
          select
          label=""
          defaultValue=""
          //helperText="Please select the age unit"
          variant="filled"
          sx={{margin: 1, padding: 1, width: "150px"}}
          onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupUnit = e.target.value}}
        >
          {ageunit.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        ),
        
      range : (
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"150px"}} onChange={(e)=>{bioMarkerTypeDataFirst.range = e.target.value}}/>
        ),
  
      bodycondition : (
        <TextField
          id="filled-basic"
          select
          label=""
          defaultValue=""
          //helperText="Please select the body condition"
          variant="filled"
          sx={{margin: 1, padding: 1, width: "150px"}}
          onChange={(e)=>{bioMarkerTypeDataFirst.bodyCondition = e.target.value}}
        >
          {bodycondition.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        )
    }
    const {columns, rows} = CreateBioMarkerTableData();
    const [row, setRow] = useState([
      obj
    ]);



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
      status: "",
      bioMarkerType: []
    });

    // At initial pushing data to biomarkertype
    formData.bioMarkerType.push(((bioMarkerTypeDataFirst)));
  
    const handleClose = () => {
      setCreateBio(false);
    };

    // data sent to backend function
    async function formSubmit(){

      if(formData.status){
        formData.status = "Active";
      } else{
        formData.status = "Inactive";
      }

      setFormData(formData);
      console.log(formData)
      const { name, unit, gender, ageGroupStartRange, ageGroupEndRange, ageGroupUnit, range, bodyCondition, status } = formData;

      setCreateBio(false);
    }
    
    // deleting one item from bio marker type
    console.log("before delete", row)
    function deleteItem(id){
        console.log("id", id, row)
        let update = row.filter((elem)=>{
          console.log(elem.id.props.children , id)
          return elem.id.props.children !== id;
        })
        setRow([...update]);
    }


    // Adding bio marker type
    function onCreate(){
      let obj = {};

      let bioMarkerTypeData = {
        gender: "",
        ageGroupStartRange: "",
        ageGroupEndRange: "",
        ageGroupUnit: "",
        range: "",
        bodyCondition: "",
      };

      obj.id = (
        <MDTypography component="a" href="#" variant="caption">
          {Date.now()}
        </MDTypography>
      );

      obj.delete = (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(e)=>{deleteItem(obj.id.props.children)}}>
          🗑️
        </MDButton>
      );

      obj.gender = (
            <TextField
            id="filled-basic"
            select
            label=""
            defaultValue=""
            //helperText="Please select your gender"
            variant="filled"
            sx={{margin: 1, padding: 1, width: "100px"}}
            onChange={(e)=>{bioMarkerTypeDataFirst.gender = e.target.value}}
          >
            {gender.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
      );

      obj.agegroupstart = ( 
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupStartRange = e.target.value}}/>
        );

      obj.agegroupend = (
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupEndRange = e.target.value}}/>
      );
        
      obj.agegroupunit = (
        <TextField
          id="filled-basic"
          select
          label=""
          defaultValue=""
          //helperText="Please select the age unit"
          variant="filled"
          sx={{margin: 1, padding: 1, width: "150px"}}
          onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupUnit = e.target.value}}
        >
          {ageunit.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        );
        
      obj.range = (
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"150px"}} onChange={(e)=>{bioMarkerTypeDataFirst.range = e.target.value}}/>
        );

      obj.bodycondition = (
        <TextField
          id="filled-basic"
          select
          label=""
          defaultValue=""
          //helperText="Please select the body condition"
          variant="filled"
          sx={{margin: 1, padding: 1, width: "150px"}}
          onChange={(e)=>{bioMarkerTypeDataFirst.bodyCondition = e.target.value}}
        >
          {bodycondition.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        );


      setRow((oldState)=> [...oldState, obj])
      formData.bioMarkerType.push(((bioMarkerTypeData)));
    }


  
    return (
      <>
        <MDBox pt={2} pb={2}>
        <MDTypography variant="h6" fontWeight="medium" borderRadius="10px" color="white" backgroundColor="#afb0b2" marginLeft="15px">
          &nbsp;&nbsp;Create Bio Marker
        </MDTypography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding: 1, width: "250px" },
          }}
          noValidate
          autoComplete="off"
        >
        <TextField
        id="filled-basic" label="Name" variant="filled"
          sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.name = e.target.value}}/>
        
        <TextField
        id="filled-basic" label="Unit" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.unit = e.target.value}}/>

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
                            Add Bio Markers Type
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

        <MDBox mt={0.5} display="flex" alignItems="center">
          <MDBox component="span" variant="button" fontWeight="light" fontSize="15px" color="text">Status</MDBox><Switch label="Status"  onChange={(e) => {formData.status = e.target.value}} />
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

export default CreateBioMarker