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





  const EditBioMarker = ({Render, setView, bioMarkerData, id}) => {

    const {columns, rows} = CreateBioMarkerTableData();
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


    const [unitDetail, setUnitDetail] = useState([]);

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



    // const [open, setOpen] = React.useState(false);
    // const theme = useTheme();
  
  
    const handleClose = () => {
      setView(false);
    };
  
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  let permissionId = useRef(0);
  let date = new Date();
  let lastModified = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  
  const {reRender, setReRender} = Render;
  const[editData, setEditData] = useState(bioMarkerData);
  
  const [Name, setName] = useState();
  const [Unit, setUnit] = useState("Unit");
  const [BioMarkerType, setBioMarkerType] = useState([]);
  const [Alias, setAlias] = useState([]);
  const [Status, setStatus] = useState([]);
  
  
  useEffect(()=>{
    let updatedData = bioMarkerData.filter((elem)=>{
        return elem._id === id
    })

    console.log("filtered bio", updatedData)
    setEditData(updatedData);
    if(updatedData.length){
        setName(updatedData[0].name);
        setUnit(updatedData[0].unit);
        setBioMarkerType(updatedData[0].bioMarkerTypes);
        setAlias(updatedData[0].alias);
        setStatus(updatedData[0].status)
    }

    
  },[bioMarkerData, id])
  
  const [formstate, setformstate] = useState({
    name: "",
    unit: "",
    bioMarkerTypes: "",
    alias: "",
    status: "",
  });
  
  // console.log(formstate);
  
  
  async function onSave() {
  
    formstate.name = Name
    formstate.unit = Unit
    formstate.bioMarkerTypes = BioMarkerType
    formstate.alias = Alias
    formstate.status = Status

  
      setformstate(formstate);
      const {name, unit, bioMarkerTypes, alias, status} = formstate;
  
  
      const res = await fetch(`${baseUrl}api/v1/roles/update/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            name, unit, bioMarkerTypes, alias, status
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

  function deleteItem(id){

  }
  
    const [editOn, setEditOn] = useState(true);
    function onEdit(){
      setEditOn(false);
    }


    BioMarkerType.map((elem)=>{

        if(elem.gender && elem.bodyCondition){
        let bioMarkerTypeDataFirst = {
            gender: "",
            ageGroupStartRange: "",
            ageGroupEndRange: "",
            ageGroupUnit: "",
            range: "",
            bodyCondition: "",
          };
    
          bioMarkerTypeDataFirst.gender = elem.gender
        let obj = {
        //   id : Date.now(),
          delete : (
              <MDButton variant="Contained" color="info" fontWeight="medium" onClick={()=>{deleteItem(elem._id)}}>
                  🗑️
              </MDButton>
          ),
          gender : (
            <TextField
              id="filled-basic"
              select
              label=""
              defaultValue=""
              variant="filled"
              sx={{margin: 1, padding: 1, width: "100px"}}
              disabled={editOn}
              onChange={(e)=>{bioMarkerTypeDataFirst.gender = e.target.value}}
              value={bioMarkerTypeDataFirst.gender}
    
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
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} value={elem.ageGroupStartRange} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupStartRange = e.target.value}}/>
            ),
      
          agegroupend : (
            <TextField
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} value={elem.ageGroupEndRange} onChange={(e)=>{bioMarkerTypeDataFirst.ageGroupEndRange = e.target.value}}/>
          ),
            
          agegroupunit : (
            <TextField
              id="filled-basic"
              select
              label=""
              defaultValue=""
              //helperText="Please select the age unit"
              variant="filled"
              value={elem.ageGroupUnit}
              sx={{margin: 1, padding: 1, width: "150px"}}
              disabled={editOn}
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
            id="filled-basic" label="" variant="filled" value={elem.range} disabled={editOn}
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
              value={elem.bodyCondition}
              disabled={editOn}
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
    
    
          rows.push(obj)
    }
        //   formData.bioMarkerType.push(((bioMarkerTypeDataFirst)));
    

    })
  
  

  
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
        id="filled-basic" label="Name" variant="filled"
          sx={{margin: 1, padding : 1, width:"300px"}} value={Name} disabled={editOn} onChange={(e)=>{ setName(e.target.value)}}/>
        
          {console.log("unit", Unit)}
        <TextField
          id="filled-basic"
          select
          label="Unit"
          defaultValue=""
          helperText="Please select unit"
          variant="filled"
          sx={{margin: 4, padding: 2, width: "200px"}}
          value={(Unit !== undefined) && Unit} 
          disabled={editOn} 
          onChange={(e)=>{ setUnit(e.target.value)}}
        >
          {unitDetail.map((option) => (
            <MenuItem key={option.unitFullName} value={option.unitFullName}>
              {option.unitFullName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
        id="filled-basic" label="Alias" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} value={Alias} disabled={editOn} onChange={(e)=>{ setAlias(e.target.value)}}/>


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
                          </MDTypography>

                          <MDButton variant="outlined" color="white" onClick={onCreate}>
                            Add
                          </MDButton> */}
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
          <MDBox component="span" variant="button" fontWeight="light" fontSize="15px" color="text">Status</MDBox><Switch checked={Status === "Active"} label="Status"  value={Status} disabled={editOn} onChange={(e) => { setStatus(e.target.value)}} />
        </MDBox>
        </Box>

        {/* <Button autoFocus onClick={formSubmit}>
          Save
        </Button>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button> */}
        </MDBox>
      </>
    );
  }

export default EditBioMarker

