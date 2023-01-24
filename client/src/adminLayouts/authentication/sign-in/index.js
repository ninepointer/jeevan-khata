/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";


// Images
 import bgImage from "../../../assets/images/loginpageimage.jpeg";
import { userContext } from '../../../AuthContext';

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(false);
  const [pass, setPassword] = useState(false);
  const setDetails = useContext(userContext);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  //console.log("sign componenet")
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"

    const navigate = useNavigate();
    let userData ;

    // const userDetail = async ()=>{
    //   try{
    //       const res = await axios.get(`${baseUrl}api/v1/users/login`, {
    //           withCredentials: true,
    //           headers: {
    //               Accept: "application/json",
    //               "Content-Type": "application/json",
    //               "Access-Control-Allow-Credentials": true
    //           },
    //       });
                   
    //       setDetails.setUserDetail(res.data);
    //       userData = res.data;
    //       //console.log("this is data of particular user", res.data);
  
    //       if(!res.status === 200){
    //           throw new Error(res.error);
    //       }
    //   } catch(err){
    //       //console.log("Fail to fetch data of user");
    //       //console.log(err);
    //   }
    // }


    async function logInButton(e){
        e.preventDefault();
        //console.log(email, pass);
        
        const res = await fetch(`${baseUrl}api/v1/users/login`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                email, password: pass
            })
        });
        
        const data = await res.json();
        //console.log(data);
        setDetails.setUserDetail(data.data);
        if(data.error || !data){
            window.alert(data.error);
            console.log("Invalid User Details");
        }else{
            window.alert("Login Succesfull");
            console.log("Entry Succesfull");

            // this function is extracting data of user who is logged in
            // await userDetail();

            navigate("/adminDashboard");
            // if(userData.role === "admin"){
            //   navigate("/adminDashboard");
            // } else if(userData.role === "user"){
            //   navigate("/Position");
            // }
            
        }
    }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Welcome to Jeevan Khata!
          </MDTypography>
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" onChange={handleEmailChange} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" onChange={handlePasswordChange} fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" onClick={logInButton} fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
