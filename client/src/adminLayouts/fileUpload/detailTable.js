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
import DetailData from './data/detailTableData';
import FileUploader from './uploadFunctionality';

const DetailTable = ({setView, bioData, id}) => {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
  const {columns, rows} = DetailData();

  const onClose = ()=>{
    setView(false)
  }
  bioData.map((elem, index)=>{
    let ocrDataObj = {}
    // const createdondate = new Date(elem.createdOn);
    // const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
    // const createdOn = createdondate.toLocaleDateString('en-US', options1)

    const key = Object.keys(elem)[0];

      ocrDataObj.bioMarkerName = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {key}
        </MDTypography>
      );
    ocrDataObj.range = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem[key]?.range}
      </MDTypography>
    );
    ocrDataObj.result = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem[key]?.result}
        </MDTypography>
      );

    ocrDataObj.unit = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem[key]?.unit}
      </MDTypography>
    );

    rows.push(ocrDataObj)
    })


    return (
        <>
        <FileUploader />
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


                               
                            </MDBox>
                            <MDButton color="blue" onClick={onClose}>
                              Close
                            </MDButton>
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

export default DetailTable