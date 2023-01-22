import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";


// Material Dashboard 2 React example components
import DashboardLayout from "../../layoutComponents/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../layoutComponents/Navbars/DashboardNavbar";
import Footer from "../../layoutComponents/Footer";
import DataTable from "../../layoutComponents/Tables/DataTable";
import EditSharpIcon from '@mui/icons-material/EditSharp';


// Data
import UserModel from './UserModel';
import activeUserData from './data/activeUserData';
import UserEditModel from "./UserEditModel";

const ActiveUser = ({setCreate}) => {
    const { columns, rows } = activeUserData();
    const [activeData, setActiveData] = useState([]);
    const [reRender, setReRender] = useState(true);

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"

    useEffect(async()=>{
  
    //   fetch(`${baseUrl}api/v1/users`)
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    //     .catch(error => console.error(error))
    // },[reRender])

    const res = await fetch(`${baseUrl}api/v1/users`, {
      method: "GET",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      });
      
      const data = await res.json();
      console.log(data);
      setActiveData(data.data);
      
    },[reRender])

    activeData.map((elem)=>{
        let activeusers = {}
    
        activeusers.edit = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
              {/* <UserEditModel data={activeData} id={elem._id} Render={{setReRender, reRender}}/> */}
            </MDButton>
          );
        activeusers.jeevankhataId = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              {elem.jeevanKhataId}
            </MDTypography>
          );
        activeusers.firstName = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              {elem.firstName}
            </MDTypography>
          );
        activeusers.lastName = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.lastName}
          </MDTypography>
        );
        activeusers.email = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.email}
          </MDTypography>
        );
        activeusers.mobile = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.mobile}
          </MDTypography>
        );
        activeusers.gender = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.gender}
          </MDTypography>
        );
        activeusers.dateOfBirth = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {/* {elem.dateOfBirth} */}
          </MDTypography>
        );
        activeusers.city = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.city}
          </MDTypography>
        );
        activeusers.state = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.state}
          </MDTypography>
        );
        activeusers.role = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.role}
          </MDTypography>
        );
        activeusers.createdOn = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.createdOn}
          </MDTypography>
        );
       
        rows.push(activeusers)
    })

    function openCreateUser(){
        setCreate(true);
    }

    return (
        <>
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
                                    Users
                                </MDTypography>

                                <MDButton variant="outlined" onClick={openCreateUser}>
                                  Create
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
        </>
    )
}

export default ActiveUser
