import React, {useState, useEffect} from 'react'
import axios from 'axios';

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
import FileUploadTableData from './data/fileUploadTableData';
import FileUploader from './uploadFunctionality';

const UploadedDataTable = ({setCreate, setView, setBioData}) => {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  const {columns, rows} = FileUploadTableData();
  const [ocrData, setOcrData] = useState([]);
  const [render, setRender] = useState(true);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/ocrData`)
    .then((res)=>{
      setOcrData(res.data.data)
    })
    .catch(()=>{
      console.log("Fail to fetch data")
    })
  },[render])

  const {checkIsView, setGetId} = setView


  function setViewFunc(id, bioMarker){
    setGetId(id);
    checkIsView(true)
    setBioData(bioMarker)
    console.log("in view func")
  }


    ocrData.map((elem)=>{
    let ocrDataObj = {}
    // const createdondate = new Date(elem.createdOn);
    // const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
    // const createdOn = createdondate.toLocaleDateString('en-US', options1)


      ocrDataObj.name = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.name}
        </MDTypography>
      );
    ocrDataObj.gender = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.gender}
      </MDTypography>
    );
    ocrDataObj.age = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.age}
        </MDTypography>
      );

    ocrDataObj.testName = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.testName}
      </MDTypography>
    );

    ocrDataObj.hospital = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.lab}
        </MDTypography>
      );

    ocrDataObj.date = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.date}
      </MDTypography>
    );


    ocrDataObj.details = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <ModeTwoToneIcon onClick={(e)=>{setViewFunc(elem._id, elem.bioMarker)}}/>
        </MDButton>
      );
   
    rows.push(ocrDataObj)
    })


    return (
        <>
        <FileUploader Render = {{render, setRender}}/>
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

                                {/* <MDTypography variant="h6" color="white" py={1}>
                                    Lab Tests
                                </MDTypography> */}

                                {/* <MDButton variant="outlined" color="white" onClick={onCreate}>
                                  Create Lab Test
                                </MDButton> */}
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

export default UploadedDataTable