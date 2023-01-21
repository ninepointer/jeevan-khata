
// Material Dashboard 2 React layouts
import AdminDashboard from "./adminLayouts/adminDashboard";
import BioMarkerLayout from "./adminLayouts/Bio Markers/bioMarkerLayout";
import UnitLayout from "./adminLayouts/units/unitLayout";
import UserLayout from "./adminLayouts/users/activeUsers";

// @mui icons
import PersonIcon from '@mui/icons-material/Person';
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
    name: "Bio Markers",
    key: "biomarkers",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <AccountBoxIcon/>,
    route: "/biomarkers",
    component: <BioMarkerLayout />,
  },
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "adminDashboard",
    icon: <DashboardIcon/>,
    route: "/adminDashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Units",
    key: "units",
    icon: <PersonIcon/>,
    route: "/units",
    component: <UnitLayout />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <PersonIcon/>,
    route: "/users",
    component: <UserLayout />,
  },

];

export default routes;
