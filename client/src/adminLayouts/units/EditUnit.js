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
import CreateUnitTableData from "./CreateUnitTableData"
import DataTable from "../../layoutComponents/Tables/DataTable";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import axios from "axios"





  const EditUnit = ({Render, setView, unitData, id}) => {

    const {columns, rows} = CreateUnitTableData();
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


    const handleChange = (e, index, checkEntity) => {
      const values = [...UnitConversionData];

      switch(checkEntity) {
        case "cunitfullname":
          values[index].unitConversionFullName = e.target.value;
          break;
        case "cunitid":
          values[index].unitConversionId = e.target.value;
          break;
        case "value":
          values[index].value = e.target.value;
        case "bioMarker":
          values[index].bioMarkers = e.target.value;          
          break;
        default:
          // code block
      }
      
      setUnitConversionData(values);
    };


    const [unitDetail, setUnitDetail] = useState([]);
    const [bioMarkerArr, setBioMarkers] = useState([]);


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/units`)
        .then((res)=>{
          setUnitDetail(res.data.data)
          console.log("res.data.data", res.data.data)
        })
        .catch(()=>{
          console.log("Fail to fetch data")
        })

        axios.get(`${baseUrl}api/v1/bioMarkers`)
        .then((res)=>{
          setBioMarkers(res.data.data)
          console.log("res.data.data", res.data.data)
        })
        .catch(()=>{
          console.log("Fail to fetch data")
        })
      },[])
  
    const handleClose = () => {
      setView(false);
    };
  
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  const {reRender, setReRender} = Render;
  const[editData, setEditData] = useState(unitData);
  
  const [UnitFullName, setUnitFullName] = useState();
  const [UnitId, setUnitId] = useState("Unit");
  const [UnitConversionData, setUnitConversionData] = useState([]);
  const [Status, setStatus] = useState([]);
  
  
  useEffect(()=>{
    let updatedData = unitData.filter((elem)=>{
        return elem._id === id
    })

    console.log("filtered bio", updatedData)
    setEditData(updatedData);
    if(updatedData.length){
        setUnitFullName(updatedData[0].unitFullName);
        setUnitId(updatedData[0].unitId);
        setUnitConversionData(updatedData[0].unitConversion);
        setStatus(updatedData[0].status)
    }

    
  },[unitData, id])
  
  const [formstate, setformstate] = useState({
    unitFullName: "",
    unitId: "",
    status: "",
    unitConversion: []
  });
  
  
  
  async function onSave() {
  
    formstate.unitFullName = UnitFullName
    formstate.unitId = UnitId
    formstate.unitConversion = UnitConversionData
    formstate.status = Status

  
      setformstate(formstate);
      console.log(formstate)
      const {unitFullName, unitId, unitConversion, status} = formstate;
  
  
      const res = await fetch(`${baseUrl}api/v1/units/update/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            unitFullName, unitId, unitConversion: unitConversion, status
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
      // setView(false);
  }
  
  async function Ondelete(){
    console.log(editData)
    const res = await fetch(`${baseUrl}api/v1/units/delete/${id}`, {
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


  async function deleteUnitConversionData(type_id, create_id){
    console.log(type_id, create_id, rows)
    if(type_id){
      const res = await fetch(`${baseUrl}api/v1/units/unitConversionDelete/${type_id}`, {
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

      UnitConversionData.map((elem)=>{
        if(elem._id === type_id){
          console.log(elem);
          elem.is_Deleted = true;
        }
      })
      // setView(false);
    } else if(create_id){
      let update = UnitConversionData.filter((elem)=>{
        return elem.id !== create_id;
      })

      console.log(update, UnitConversionData)
      setUnitConversionData([...update]);
    }
    
    reRender ? setReRender(false) : setReRender(true)
  }
  
    const [editOn, setEditOn] = useState(true);
    function onEdit(){
      setEditOn(false);
    }

    console.log("UnitConversionData", UnitConversionData)
    UnitConversionData?.map((elem, index)=>{

      console.log("elem", elem)
        if(!elem.is_Deleted){
        let obj = {
          // id : Date.now(),
          delete : (
              <MDButton disabled={editOn} variant="Contained" color="info" fontWeight="medium" onClick={()=>{deleteUnitConversionData(elem._id, elem.id , "database")}}>
                  🗑️
              </MDButton>
          ),
          cunitfullname : (
            <TextField
            id="filled-basic" label="" variant="filled"  disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} 
            onChange={e => handleChange(e, index, "cunitfullname")}
            value={elem.unitConversionFullName} 
            />
          ),
      
          cunitid : ( 
            <TextField
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} 
            onChange={e => handleChange(e, index, "cunitid")}
            value={elem.unitConversionId} 
            />
            ),
      
            value : (
            <TextField
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} 
            onChange={e => handleChange(e, index, "value")}
            value={elem.value} 
            />
          ),

          bioMarkers : (
            <TextField
              id="filled-basic"
              select
              label=""
              defaultValue=""
              helperText="Please select bio marker"
              variant="filled"
              sx={{margin: 1, padding: 1, width: "150px"}}
              value={elem.bioMarkers} 
              disabled={editOn}
              onChange={e => handleChange(e, index, "bioMarker")}
            >
              {bioMarkerArr.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            )

        }
          rows.push(obj)
      }
    })




    function onCreate(){

      let unitConversionData = {
        unitConversionFullName: "",
        unitConversionId: "",
        value: "",
        bioMarkers: ""
        };

    let obj = {
      id : Date.now(),
      delete : (
          <MDButton variant="Contained" color="info" fontWeight="medium" onClick={()=>{deleteUnitConversionData(obj.id, "created")}}>
              🗑️
          </MDButton>
      ),
      cunitfullname : ( 
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{unitConversionData.unitConversionFullName = e.target.value}}/>
        ),
  
        cunitid : ( 
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{unitConversionData.unitConversionId = e.target.value}}/>
        ),
  
        value : (
        <TextField
        id="filled-basic" label="" variant="filled" type="number"
        sx={{margin: 1, padding : 1, width:"100px"}} onChange={(e)=>{unitConversionData.value = e.target.value}}/>
      ),

      bioMarkers: (
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
        )
        
    }

    console.log(obj)
      rows.push(obj)
    //   console.log(rows)
      setUnitConversionData((oldState)=> [...oldState, obj])
      formstate.unitConversion.push(((obj)));
    }
  
  
    return (
      <>

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

        <MDBox pt={2} pb={2}>

        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding: 1, width: "250px" },
          }}
          noValidate
          autoComplete="off"
        >
        <TextField
        id="filled-basic" label="Unit Full Name" variant="filled"
          sx={{margin: 1, padding : 1, width:"300px"}} value={UnitFullName} disabled={editOn} onChange={(e)=>{ setUnitFullName(e.target.value)}}/>
        
        <TextField
        id="filled-basic" label="Unit ID" variant="filled"
          sx={{margin: 1, padding : 1, width:"300px"}} value={UnitId} disabled={editOn} onChange={(e)=>{ setUnitId(e.target.value)}}/>


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

                          {/* <MDTypography variant="h6" color="white" py={1}>
                            Add Bio Markers Type
                          </MDTypography> */}

                          <MDButton disabled={editOn} variant="outlined" color="white" onClick={onCreate}>
                            Add
                          </MDButton>
                      </MDBox>
                      <MDBox pt={2}>
                          <DataTable
                              table={{ columns, rows }}
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
          <MDBox component="span" variant="button" fontWeight="light" fontSize="15px" color="text">Status</MDBox>
          <Switch checked={Status === "Active"} label="Status"  value={Status} disabled={editOn} onClick={() => setStatus(prevStatus => prevStatus === "Active" ? "Inactive" : "Active" )}  />
        </MDBox>
        </Box>
        </MDBox>
      </>
    );
  }

export default EditUnit