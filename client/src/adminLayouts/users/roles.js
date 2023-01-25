import React, {useState, useEffect} from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ModeTwoToneIcon from '@mui/icons-material/ModeTwoTone';


// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "../../layoutComponents/Tables/DataTable";

// Data
import RolesModel from './RolesModel';
import RolesData from './data/rolesData';

const UserRoles = ({setCreate, setEditData, setView}) => {
    const { columns, rows } = RolesData();
    function openCreateUser(){
        setCreate(true);
    }

    const {checkIsView, setGetId} = setView
    const [role,setRole] = useState([]);
    const [reRender, setReRender] = useState(true);


    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    async function getRole (){
      const res = await fetch(`${baseUrl}api/v1/roles`, {
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
    setRole(data.data);
      //rows = data.data;
      console.log(data.data)
    }

    useEffect(()=>{
        getRole()
      .then();
    },[reRender])

    function setViewFunc(id){

      // isView.checking = true;
      setGetId(id);
      checkIsView(true)
      setEditData(role)
      console.log("in view func")
    }


    role.map((elem)=>{
      let roleRow = {}
    //   const dobdate = new Date(elem.dateOfBirth);
    //   const options = { year: 'numeric', month: 'short', day: 'numeric' };
    //   const dob = dobdate.toLocaleDateString('en-US', options);
      const createdondate = new Date(elem.createdOn);
      const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
      const createdOn = createdondate.toLocaleDateString('en-US', options1)
      //const statuscolor = elem.status == "Active" ? "success" : "error"
  
      roleRow.view = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <ModeTwoToneIcon onClick={(e)=>{setViewFunc(elem._id)}}/>{/* <UserEditModel data={roleRow} id={elem._id} Render={{setReRender, reRender}}/> */}
          </MDButton>
        );
        roleRow.roleName = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.roleName.toUpperCase()}
          </MDTypography>
        );
      roleRow.reportAccess = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {String(elem.reportAccess).toUpperCase()}
        </MDTypography>
      );
      roleRow.userAccess = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {String(elem.userAccess).toUpperCase()}
        </MDTypography>
      );
      roleRow.attrubitesAccess = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {String(elem.attributesAccess).toUpperCase()}
        </MDTypography>
      );
      roleRow.analyticsAccess = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {String(elem.analyticsAccess).toUpperCase()}
        </MDTypography>
      );
      roleRow.createdOn = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {createdOn}
        </MDTypography>
      );
      roleRow.status = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {(elem.status)}
        </MDTypography>
      );
     
      rows.push(roleRow)
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