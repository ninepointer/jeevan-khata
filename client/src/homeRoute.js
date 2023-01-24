
// Material Dashboard 2 React layouts
import Users from "./adminLayouts/users";
import LabTest from "./adminLayouts/labTests/labTestLayout";
import AdminDashboard from "./adminLayouts/adminDashboard";
import Units from "./adminLayouts/units/unitLayout";
import BioMarkerLayout from "./adminLayouts/Bio Markers/bioMarkerLayout";
import SignIn from "./adminLayouts/authentication/sign-in/index";

// @mui icons
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import BiotechTwoToneIcon from '@mui/icons-material/BiotechTwoTone';
import HealingTwoToneIcon from '@mui/icons-material/HealingTwoTone';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableViewIcon from '@mui/icons-material/TableView';
import BusinessIcon from '@mui/icons-material/Business';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Icon from "@mui/material/Icon";

import SummarizeIcon from '@mui/icons-material/Summarize';
import InventoryIcon from '@mui/icons-material/Inventory'; 
import SettingsIcon from '@mui/icons-material/Settings';
import { useContext } from "react";
import { userContext } from "./AuthContext";
// import SettingIcon from '@mui/icons-material/Setting'; 


// const getDetails = useContext(userContext)
// console.log(getDetails)

const homeRoutes = [
 
  {
    // type: "collapse",
    // name: "Sign In",
    // key: "signin",
    // icon: <Icon fontSize="small">person</Icon>,
    // icon: <GridViewTwoToneIcon/> SignIn,
    route: "*",
    // component: < />,
  }

];

export default homeRoutes;