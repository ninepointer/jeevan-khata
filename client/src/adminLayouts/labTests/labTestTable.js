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
import LabTestData from './data/labTestData';

const LabTest = ({setCreate, setView, setEditData}) => {

  const {columns, rows} = LabTestData();
//   function onCreate(){
//     setCreateLabTest(true); 
//   }

  const {checkIsView, setGetId} = setView
//   const { columns, rows } = activeUserData();
  const [labTestData,setLabTestData] = useState([]);
  const [reRender, setReRender] = useState(true);

  function onCreate(){
      console.log("in open")
      setCreate(true);
  }

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  async function getLabTestFunc (){
    const res = await fetch(`${baseUrl}api/v1/labTests`, {
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
    setLabTestData(data.data);
    //rows = data.data;
    console.log(data.data)
  }

  useEffect(()=>{
    getLabTestFunc()
    .then();
  },[reRender])

  function setViewFunc(id){

    // isView.checking = true;
    setGetId(id);
    checkIsView(true)
    setEditData(labTestData)
    console.log("in view func")
  }


  console.log("labTestData", labTestData)
  labTestData.map((elem)=>{
    let labTestRow = {}
    const createdondate = new Date(elem.createdOn);
    const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
    const createdOn = createdondate.toLocaleDateString('en-US', options1)

    labTestRow.view = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <ModeTwoToneIcon onClick={(e)=>{setViewFunc(elem._id)}}/>{/* <UserEditModel data={labTestRow} id={elem._id} Render={{setReRender, reRender}}/> */}
        </MDButton>
      );
      labTestRow.testName = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.testName}
        </MDTypography>
      );
    labTestRow.testScientificName = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.testScientificName}
      </MDTypography>
    );
    labTestRow.biomarkers = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.bioMarkers.length}
        </MDTypography>
      );
    labTestRow.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );

    labTestRow.createdOn = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {createdOn}
      </MDTypography>
    );
   
    rows.push(labTestRow)
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
                                    Lab Tests
                                </MDTypography>

                                <MDButton variant="outlined" color="white" onClick={onCreate}>
                                  Create Lab Test
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

export default LabTest