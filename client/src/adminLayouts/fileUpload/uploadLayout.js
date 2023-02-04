// Material Dashboard 2 React example components
import DashboardLayout from "../../layoutComponents/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../layoutComponents/Navbars/DashboardNavbar";
import Footer from "../../layoutComponents/Footer";


// Data
import Header from "./Header";
import FileUploader from "./uploadFunctionality";

function uploadLayout() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      {/* <FileUploader /> */}
      <Header/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default uploadLayout;
