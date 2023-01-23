
// Material Dashboard 2 React layouts
import Users from "./adminLayouts/users";
import LabTest from "./adminLayouts/labTests/labTestLayout";
import AdminDashboard from "./adminLayouts/adminDashboard";
import Units from "./adminLayouts/units/unitLayout";
import BioMarkerLayout from "./adminLayouts/Bio Markers/bioMarkerLayout";

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
// import SettingIcon from '@mui/icons-material/Setting'; 


const routes = [
 
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "adminDashboard",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <GridViewTwoToneIcon/>,
    route: "/adminDashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Lab Tests",
    key: "labTests",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <BiotechTwoToneIcon/>,
    route: "/labTests",
    component: <LabTest />,
  },
  {
    type: "collapse",
    name: "Bio Markers",
    key: "biomarkers",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <HealingTwoToneIcon/>,
    route: "/biomarkers",
    component: <BioMarkerLayout />,
  },
  {
    type: "collapse",
    name: "Units",
    key: "units",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <ScaleTwoToneIcon/>,
    route: "/units",
    component: <Units />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <PeopleAltTwoToneIcon/>,
    route: "/users",
    component: <Users />,
  },

];

export default routes;