// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../layoutComponents/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../layoutComponents/Navbars/DashboardNavbar";
import Footer from "../../layoutComponents/Footer";

// Data
import UserHeader from "./Header";

function UserLayout() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <UserHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default UserLayout;
