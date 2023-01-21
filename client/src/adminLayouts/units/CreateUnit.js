import * as React from 'react';
import {useContext, useState, useEffect} from "react";
import Button from '@mui/material/Button';
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


  const CreateUnit = ({setCreateUnit}) => {
    // const {reRender, setReRender} = Render
    let obj = {
      id : (
        <MDTypography component="a" variant="caption">
          {"0001"}
        </MDTypography>
      ),
      delete : (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(id)=>{deleteItem("0001")}}>
          🗑️
        </MDButton>
      ),
  
      cunitfullname : ( 
        <TextField
        id="outlined-basic" label="" variant="standard"
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{unitConversionData.unitConversionFullName = e.target.value}}/>
        ),
  
      cunitid : (
        <TextField
        id="outlined-basic" label="" variant="standard"
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{unitConversionData.unitConversionId = e.target.value}}/>
      ),
        
      value : (
        <TextField
        id="outlined-basic" label="" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"150px"}} onChange={(e)=>{unitConversionData.value = e.target.value}}/>
        ),
    }
    const {columns, rows} = CreateUnitTableData();
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
      unitFullName: "",
      unitId: "",
      status: "",
      unitConversionData: [
        
      ]
    });

    let [unitConversionData, setUnitConversionData] = useState({
      unitConversionFullName: "",
      unitConversionId: "",
      value: "",
    })

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [render, setRender] = useState(true);
  
    const handleClose = () => {
      setCreateUnit(false);
    };

    // data sent to backend function
    async function formSubmit(){

      setFormData(formData);
      // console.log(formData)
      const { unitFullName, unitId, status } = formData;

      setCreateUnit(false);
    }
    
    function deleteItem(id){
      // if(row.length !== 1){
        let update = row.filter((elem)=>{
          console.log(elem.id.props.children , id)
          return elem.id.props.children !== id;
        })
        setRow(update);
      // }
    }

    console.log("row outer", row)

    function actionButton(id){
      let update = row.filter((elem)=>{
        // console.log(elem.id.props.children , id)
        return elem.id.props.children === id;
      })
      // let tempArr = tempArr.push(update[0]); 
      console.log(update[0])
      setUnitConversionData(unitConversionData);
      formData.unit.push(JSON.parse(JSON.stringify(unitConversionData)));
      // setAddedBio(tempArr);
      // deleteItem(id);
      // console.log(formData)
    }


    function onCreate(){
      let obj = {};

      obj.id = (
        <MDTypography component="a" variant="caption">
          {Date.now()}
        </MDTypography>
      );

      // console.log("id", obj.id)

      obj.delete = (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(e)=>{deleteItem(obj.id.props.children)}}>
          🗑️
        </MDButton>
      );

      obj.cunitfullname = (
        <TextField
        id="outlined-basic" label="" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{unitConversionData.unitConversionFullName = e.target.value}}/>
        );

      obj.cunitid = ( 
        <TextField
        id="outlined-basic" label="" variant="standard" type={" number"}
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{unitConversionData.unitConversionId = e.target.value}}/>
        );

      obj.value = (
        <TextField
        id="outlined-basic" label="" variant="standard" type="number"
        sx={{margin: 1, padding : 1, width:"150px"}} onChange={(e)=>{unitConversionData.value = e.target.value}}/>);

        // tempRow.push(obj);
      setRow((oldState)=> [...oldState, obj])



      render ? setRender(false):setRender(true)
    }


    console.log(formData)
  
    return (
      <>
        <TextField
        id="outlined-basic" label="Unit FullName" variant="standard"
          sx={{margin: 1, padding : 2, width:"300px"}} onChange={(e)=>{formData.unitFullName = e.target.value}}/>
        
        <TextField
        id="outlined-basic" label="Unit Id" variant="standard"
        sx={{margin: 1, padding : 2, width:"300px"}} onChange={(e)=>{formData.unitId = e.target.value}}/>

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

                          <MDTypography variant="h6" color="white" py={1}>
                            Add Unit Conversion
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
      </>
    );
  }

export default CreateUnit