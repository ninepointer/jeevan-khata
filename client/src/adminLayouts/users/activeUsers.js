import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ModeTwoToneIcon from '@mui/icons-material/ModeTwoTone';

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

const ActiveUser = ({setCreateUser}) => {
    const { columns, rows } = activeUserData();
    const [activeUsers,setActiveUsers] = useState([]);
    const [reRender, setReRender] = useState(true);

    function openCreateUser(){
        console.log("in open")
        setCreateUser(true);
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    async function getActiveUsers (){
      const res = await fetch(`${baseUrl}api/v1/users`, {
        method: "GET",
        credentials:"include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
      },
    )
    let data = await res.json()
      setActiveUsers(data.data);
      //rows = data.data;
      console.log(data.data)
    }

    useEffect(()=>{
      getActiveUsers()
      .then();
    },[reRender])


    activeUsers.map((elem)=>{
      let activeusersrows = {}
      const dobdate = new Date(elem.dateOfBirth);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const dob = dobdate.toLocaleDateString('en-US', options);
      const createdondate = new Date(elem.createdOn);
      const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
      const createdOn = createdondate.toLocaleDateString('en-US', options1)
      //const statuscolor = elem.status == "Active" ? "success" : "error"
  
      activeusersrows.edit = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <ModeTwoToneIcon/>{/* <UserEditModel data={activeusersrows} id={elem._id} Render={{setReRender, reRender}}/> */}
          </MDButton>
        );
        activeusersrows.jeevankhataId = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.jeevanKhataId}
          </MDTypography>
        );
      activeusersrows.firstName = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.firstName}
        </MDTypography>
      );
      activeusersrows.lastName = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.lastName}
        </MDTypography>
      );
      activeusersrows.email = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.email}
        </MDTypography>
      );
      activeusersrows.mobile = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.mobile}
        </MDTypography>
      );
      activeusersrows.gender = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.gender}
        </MDTypography>
      );
      activeusersrows.dateOfBirth = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {dob}
        </MDTypography>
      );
      activeusersrows.city = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.city}
        </MDTypography>
      );
      activeusersrows.state = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.state}
        </MDTypography>
      );
      activeusersrows.role = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.role.roleName}
        </MDTypography>
      );
      activeusersrows.createdOn = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {createdOn}
        </MDTypography>
      );
     
      rows.push(activeusersrows)
    })

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