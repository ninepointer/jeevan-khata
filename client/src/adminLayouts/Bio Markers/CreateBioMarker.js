import * as React from 'react';
import {useContext, useState, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label"></InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label=""
              sx={{margin: 1, padding : 1, width:"50px"}}
              onChange={(e)=>{bioMarkerTypeDataFirst.gender = e.target.value}}
              >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
        </FormControl>
      ),
  
      agegroupstart : ( 
        <TextField
        id="outlined-basic" label="" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupStartRange = e.target.value}}/>
        ),
  
      agegroupend : (
        <TextField
        id="outlined-basic" label="" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupEndRange = e.target.value}}/>
      ),
        
      agegroupunit : (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupUnit = e.target.value}}/>
        ),
        
      range : (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeDataFirst.range = e.target.value}}/>
        ),
  
      bodycondition : (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeDataFirst.bodyCondition = e.target.value}}/>
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
        <FormControl variant="standard" >
          <InputLabel id="demo-simple-select-standard-label"></InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label=""
              sx={{margin: 1, padding : .7, width:"50px"}}
              onChange={(e)=>{bioMarkerTypeData.gender = e.target.value}}
              
              >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
        </FormControl>
      );

      obj.agegroupstart = ( 
        <TextField
        id="outlined-basic" label="" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupStartRange = e.target.value}}
         />
        );

      obj.agegroupend = (
        <TextField
        id="outlined-basic" label="" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupEndRange = e.target.value}}
        />);
        
      obj.agegroupunit = (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupUnit = e.target.value}}
         />);
        
      obj.range = (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.range = e.target.value}}
        />);

      obj.bodycondition = (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.bodyCondition = e.target.value}}
        />);


      setRow((oldState)=> [...oldState, obj])
      formData.bioMarkerType.push(((bioMarkerTypeData)));
    }


  
    return (
      <div>
        <TextField
        id="outlined-basic" label="Name" variant="standard"
          sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.name = e.target.value}}/>
        
        <TextField
        id="outlined-basic" label="Unit" variant="standard"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.unit = e.target.value}}/>

        <MDBox pt={6} pb={3}>
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

                          <MDTypography variant="h6" color="white" py={2.5}>
                            Add Bio Markers Type
                          </MDTypography>

                          <MDButton variant="outlined" color="white" onClick={onCreate}>
                            Add
                          </MDButton>
                      </MDBox>
                      <MDBox pt={3}>
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


        <Button autoFocus onClick={formSubmit}>
          Save
        </Button>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </div>
    );
  }

export default CreateBioMarker