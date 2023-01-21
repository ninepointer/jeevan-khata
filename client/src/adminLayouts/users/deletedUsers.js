import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDBox";


// Material Dashboard 2 React example components
import DashboardLayout from "../../layoutComponents/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../layoutComponents/Navbars/DashboardNavbar";
import Footer from "../../layoutComponents/Footer";
import DataTable from "../../layoutComponents/Tables/DataTable";
import EditSharpIcon from '@mui/icons-material/EditSharp';


// Data
import deletedUserData from './data/deletedUsersData';

const deletedUser = () => {
    const { columns, rows } = deletedUserData();

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
                                    Jeevan Khata Active Users
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
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

export default deletedUser