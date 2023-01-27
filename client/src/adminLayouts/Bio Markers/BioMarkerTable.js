import React, {useState, useEffect} from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ModeTwoToneIcon from '@mui/icons-material/ModeTwoTone';


// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 React example components
import DataTable from "../../layoutComponents/Tables/DataTable";
import BioMarkerData from './data/bioMarkerData';

// Data
// import RolesModel from './RolesModel';
// import RolesData from './data/rolesData';


const BioMarkerTable = ({setCreateBio, setView, setEditData, reRender}) => {

  const {columns, rows} = BioMarkerData();
  function onCreate(){
    setCreateBio(true);
  }


  const {checkIsView, setGetId} = setView
  const [bioMarkerData,setBioMarkerData] = useState([]);
  // const [reRender, setReRender] = useState(true);

//   function openCreateUser(){
//       console.log("in open")
//       setCreate(true);
//   }

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  async function getActiveUsers (){
    const res = await fetch(`${baseUrl}api/v1/bioMarkers`, {
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
    setBioMarkerData(data.data);
    //rows = data.data;
    console.log(data.data)
  }

  useEffect(()=>{
    getActiveUsers()
    .then();
  },[reRender])

  function setViewFunc(id){

    // isView.checking = true;
    setGetId(id);
    checkIsView(true)
    setEditData(bioMarkerData)
    console.log("in view func")
  }


  bioMarkerData.map((elem)=>{
    let bioMarkerRow = {}
    const createdondate = new Date(elem.createdOn);
    const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
    const createdOn = createdondate.toLocaleDateString('en-US', options1)

    // let length = 0;
    // if(elem.gender && elem.bodyCondition){
    //   length += 1;
    // }

    let bioTypes = elem.bioMarkerTypes.filter((subelem)=>{
                      return !subelem.is_Deleted
                  })
     

    bioMarkerRow.view = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <ModeTwoToneIcon onClick={(e)=>{setViewFunc(elem._id)}}/>
        </MDButton>
      );
      bioMarkerRow.name = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.name}
        </MDTypography>
      );
    bioMarkerRow.unit = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.unit}
      </MDTypography>
    );
    bioMarkerRow.bioMarkerTypeCount = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        { bioTypes.length}
      </MDTypography>
    );
    bioMarkerRow.createdOn = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {createdOn}
      </MDTypography>
    );
   
    rows.push(bioMarkerRow)
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
                                    Bio Markers
                                </MDTypography>

                                <MDButton variant="outlined" color="white" onClick={onCreate}>
                                  Create Bio Marker
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

export default BioMarkerTable