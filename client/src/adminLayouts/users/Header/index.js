import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import DashboardLayout from "../../../layoutComponents/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../layoutComponents/Navbars/DashboardNavbar";
import Footer from "../../../layoutComponents/Footer";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import PersonIcon from '@mui/icons-material/Person';
import burceMars from "../../../assets/images/bruce-mars.jpg";
import backgroundImage from "../../../assets/images/bg-profile.jpeg";
import ActiveUsers from "../activeUsers";
import DeletedUsers from "../deletedUsers";
import Roles from "../roles";
import UserModel from "../UserModel";
import RolesModel from "../RolesModel"



function UserHeader({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [isCreate, checkIsCreate] = useState(false);


  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    
    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);


  const handleSetTabValue = (event, newValue) => setTabValue(newValue);


  return (
   
    <MDBox position="relative" mb={5}>

      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="x1"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
      
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
            <AppBar position="static">
              {/* <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}> */}
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Active Users"
                  icon={
                    <PersonIcon fontSize="small" sx={{ mt: -0.25}}/>
                  }
                />
                <Tab
                  label="Deleted Users"
                  icon={
                    <PersonIcon fontSize="small" sx={{ mt: -0.25}}/>
                  }
                />

                <Tab
                  label="Roles"
                  icon={
                    <PersonIcon fontSize="small" sx={{ mt: -0.25}}/>
                     }
                />
             
              </Tabs>
            </AppBar>
            {console.log(isCreate)}
            {isCreate ?
            <TabPanel value={tabValue} index={0}>< UserModel setCreate={checkIsCreate}/> </TabPanel>
              :
            <TabPanel value={tabValue} index={0}>< ActiveUsers setCreate={checkIsCreate}/> </TabPanel>}
            <TabPanel value={tabValue} index={1}><DeletedUsers/> </TabPanel>
            {isCreate ?
            <TabPanel value={tabValue} index={2}><RolesModel setCreate={checkIsCreate}/> </TabPanel>
              :
            <TabPanel value={tabValue} index={2}><Roles setCreate={checkIsCreate}/> </TabPanel>}

          </Grid>
        </Grid>
        </Card>
        {/* {children} */}
     
     </MDBox>
   
    
  );
}

// Setting default props for the Header
UserHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
UserHeader.propTypes = {
  children: PropTypes.node,
};

function TabPanel(props){
  const{children,value,index}=props;
  return(
    <>
    {
      value === index &&
      <h1>{children}</h1>
    }
     {/* <TableOne/> */}
    </>
   
  )
}

export default UserHeader;