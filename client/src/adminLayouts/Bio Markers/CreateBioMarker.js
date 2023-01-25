import * as React from 'react';
import {useContext, useState, useEffect, useRef} from "react";
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
import axios from "axios"





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
      {
        value: 'Normal',
        label: 'Normal',
      },

    ];

    // let bioMarkerTypeDataFirst = {
    //   gender: "",
    //   ageGroupStartRange: "",
    //   ageGroupEndRange: "",
    //   ageGroupUnit: "",
    //   range: "",
    //   bodyCondition: "",
    // };

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"

    const {columns, rows} = CreateBioMarkerTableData();
    const [unitDetail, setUnitDetail] = useState([]);
    const [render, serRender] = useState(true);
    const [row, setRow] = useState([
    ]);
  const [id, setId] = useState(null);

  function deleteItem(id){
    //console.log(id)
    setId(id);
  }

useEffect(() => {
  let update = row.filter((elem)=>{
    return elem.id !== id;
  })

  //console.log("update", update);
  setRow([...update]);
  // if(id){
  //   setRow(prevRow => prevRow.filter((elem)=> {//console.log(elem.id, id); return elem.id !== id}));
  // }
}, [id])


    // useEffect(async ()=>{
    //   const res = await fetch(`${baseUrl}api/v1/units`, {
    //     method: "GET",
    //     credentials:"include",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Credentials": true
    //     }
    //   })
  
    //   const data = await res.json();
            
    //   //console.log("role", data);
    //   setUnitDetail(data.data)
  
    // }, [])

    useEffect(()=>{
      axios.get(`${baseUrl}api/v1/units`)
      .then((res)=>{
        setUnitDetail(res.data.data)
        console.log("res.data.data", res.data.data)
      })
      .catch(()=>{
        console.log("Fail to fetch data")
      })
    },[])



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
      alias: "",
      bioMarkerType: []
    });

    // At initial pushing data to biomarkertype
    // formData.bioMarkerType.push(((bioMarkerTypeDataFirst)));
  
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
      //console.log(formData)
      const { name , unit , status, bioMarkerType, alias} = formData;
      let aliasArr = alias.split(",");
      const res = await fetch(`${baseUrl}api/v1/bioMarkers`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          name , unit , status,  bioMarkerTypes: bioMarkerType, alias: aliasArr
        })
    });
    
    const data = await res.json();
             
      //console.log(data);
      if(data.status === 422 || data.error || !data){ 
          window.alert(data.error);
          //console.log("Invalid Entry");
      }else{
          window.alert("Bio Marker Created Successfully");
          //console.log("entry succesfull");
      }
      setCreateBio(false);
    }
    let temp = useRef([]);
    // deleting one item from bio marker type
    //console.log("row", row, temp.current)

    function onCreate(){
      // let obj = {};

      let bioMarkerTypeDataFirst = {
        gender: "",
        ageGroupStartRange: "",
        ageGroupEndRange: "",
        ageGroupUnit: "",
        range: "",
        bodyCondition: "",
      };

    let obj = {
      id : Date.now(),
      delete : (
          <MDButton variant="Contained" color="info" fontWeight="medium" onClick={()=>{deleteItem(obj.id)}}>
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
          // onChange={(e) => {
          //   setBioMarkerTypeDataFirst({
          //     ...bioMarkerTypeDataFirst,
          //     gender: e.target.value,
          //   });
          // }}

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


      setRow((oldState)=> [...oldState, obj])
      formData.bioMarkerType.push(((bioMarkerTypeDataFirst)));
      // render ? serRender(false) : serRender(true)
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
        
        {/* <TextField
        id="filled-basic" label="Unit" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.unit = e.target.value}}/> */}

        <TextField
          id="filled-basic"
          select
          label="Unit"
          defaultValue=""
          helperText="Please select unit"
          variant="filled"
          sx={{margin: 4, padding: 2, width: "200px"}}
          onChange={(e)=>{formData.unit = e.target.value}}
        >
          {unitDetail.map((option) => (
            <MenuItem key={option.unitFullName} value={option.unitFullName}>
              {option.unitFullName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
        id="filled-basic" label="Alias" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.alias = e.target.value}}/>


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

