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





// const CreateBioMarker = ({Render}) => {
  const CreateBioMarker = ({setCreateBio}) => {
    // const {reRender, setReRender} = Render
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
              onChange={(e)=>{bioMarkerTypeData.gender = e.target.value}}
              >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
        </FormControl>
      ),
  
      agegroupstart : ( 
        <TextField
        id="outlined-basic" label="" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupStartRange = e.target.value}}/>
        ),
  
      agegroupend : (
        <TextField
        id="outlined-basic" label="" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupEndRange = e.target.value}}/>
      ),
        
      agegroupunit : (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupUnit = e.target.value}}/>
        ),
        
      range : (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.range = e.target.value}}/>
        ),
  
      bodycondition : (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.bodyCondition = e.target.value}}/>
        ),
        action : (
          <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(id)=>{actionButton("0001")}}>
          OK
        </MDButton>
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
      bioMarkerType: [
        
      ]
    });

    let [bioMarkerTypeData, setBioMarkerTypeData] = useState({
      gender: "",
      ageGroupStartRange: "",
      ageGroupEndRange: "",
      ageGroupUnit: "",
      range: "",
      bodyCondition: "",
    })

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [render, setRender] = useState(true);
      
    // useEffect(()=>{

    // }, [render, row])

    // console.log(getDetails)
    // let createdBy = getDetails.userDetails.name

  
    const handleClose = () => {
      setCreateBio(false);
    };

    // data sent to backend function
    async function formSubmit(){

      setFormData(formData);
      // console.log(formData)
      const { name, unit, gender, ageGroupStartRange, ageGroupEndRange, ageGroupUnit, range, bodyCondition, status } = formData;

      // const res = await fetch(`${baseUrl}api/v1/instrument`, {
      //     method: "POST",
      //     credentials:"include",
      //     headers: {
      //         "content-type" : "application/json",
      //         "Access-Control-Allow-Credentials": true
      //     },
      //     body: JSON.stringify({
      //       name, unit, gender, ageGroupStartRange, ageGroupEndRange, ageGroupUnit, range, bodyCondition, status, uId, lastModifiedOn, lastModifiedBy, isDeleted, createdBy, createdOn
      //     })
      // });

      // const data = await res.json();
      // console.log(data);
      // if (data.status === 422 || data.error || !data) {
      //     window.alert(data.error);
      // } else {
      //     // window.alert("Bio Marker Created Succesfully");
      //     console.log("entry succesfull");
      // }
      // reRender ? setReRender(false) : setReRender(true)
      setCreateBio(false);
    }
    
    function deleteItem(id){
      if(row.length !== 1){
        let update = row.filter((elem)=>{
          console.log(elem.id.props.children , id)
          return elem.id.props.children !== id;
        })
        setRow(update);
      }
    }

    console.log("row outer", row)

    function actionButton(id){
      let update = row.filter((elem)=>{
        // console.log(elem.id.props.children , id)
        return elem.id.props.children === id;
      })
      let tempArr = tempArr.push(update[0]); 
      setBioMarkerTypeData(update[0]);
      formData.bioMarkerType.push(update[0]);
      setAddedBio(tempArr);
      deleteItem(id);
    }


    function onCreate(){
      let obj = {};

      obj.id = (
        <MDTypography component="a" href="#" variant="caption">
          {Date.now()}
        </MDTypography>
      );

      // console.log("id", obj.id)

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
        // "vijay"
      );

      obj.agegroupstart = ( 
        <TextField
        id="outlined-basic" label="" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupStartRange = e.target.value}}/>
        );

      obj.agegroupend = (
        <TextField
        id="outlined-basic" label="" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupEndRange = e.target.value}}/>);
        
      obj.agegroupunit = (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.ageGroupUnit = e.target.value}}/>);
        
      obj.range = (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.range = e.target.value}}/>);

      obj.bodycondition = (
        <TextField
        id="outlined-basic" label="" variant="standard" 
        sx={{margin: 1, padding : 1, width:"50px"}} onChange={(e)=>{bioMarkerTypeData.bodyCondition = e.target.value}}/>);

      obj.action = (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(id)=>{actionButton(obj.id.props.children)}}>
        OK
      </MDButton>
        );

        // tempRow.push(obj);
      setRow((oldState)=> [...oldState, obj])



      render ? setRender(false):setRender(true)
    }


    console.log(row)
  
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

                          <MDButton variant="outlined" color="info" onClick={onCreate}>
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
          OK
        </Button>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </div>
    );
  }

export default CreateBioMarker