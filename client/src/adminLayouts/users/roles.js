import React from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "../../layoutComponents/Tables/DataTable";

// Data
import RolesModel from './RolesModel';
import RolesData from './data/rolesData';

const UserRoles = ({setCreate}) => {
    const { columns, rows } = RolesData();
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

                                <MDTypography variant="h6" color="white" py={2.5}>
                                    User Roles
                                </MDTypography>
                                <MDButton variant="outlined" color="white" onClick={openCreateUser} >
                                    Create Role
                                </MDButton>
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

export default UserRoles