import { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios"

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import SettingsIcon from '@mui/icons-material/Settings';


// Material Dashboard 2 React components
import MDBox from "./components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "./layoutComponents/Sidenav";
import Configurator from "./layoutComponents/Configurator";

// Material Dashboard 2 React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "./routes";
import homeRoutes from "./homeRoute";
// import adminRoutes from "./routes";
// import userRoutes from "./routesUser";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "./context";

// Images
import brandWhite from "./assets/images/logo-ct.png";
import brandDark from "./assets/images/logo-ct-dark.png";
// import SignIn from "./layouts/authentication/sign-in"
import { userContext } from "./AuthContext";
import BioMarkerLayout from "./adminLayouts/Bio Markers/bioMarkerLayout";
import SignIn from "./adminLayouts/authentication/sign-in/index"
import Cookies from 'js-cookie';

export default function App() {
  const cookieValue = Cookies.get("jwt");
  ////console.log("cookieValue", cookieValue);
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  // const [routes1, setRoutes] = useState();
  const [detailUser, setDetailUser] = useState({});
  const { pathname } = useLocation();

  //get userdetail who is loggedin
  const setDetails = useContext(userContext);
  const getDetails = useContext(userContext);
  ////console.log("app getdetail", getDetails)

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // const setDetails = useContext(userContext);
  // const getDetails = useContext(userContext);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"


  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/users/logindetail`, {
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res)=>{
      ////console.log("response", res.data)
      setDetails.setUserDetail(res.data.data);
      setDetailUser((res.data.data));


    }).catch((err)=>{
      console.log("Fail to fetch data of user");
      return;

    })
            
  }, [])


  // Change the openConfigurator state 
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction, getDetails]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname, getDetails]);


  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });


  console.log("pathname", pathname)
  return direction === "rtl" ? (
      
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
          <CssBaseline />
          {layout === "companyposition" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Jeevan Khata"
                routes={(detailUser.role === "63cb5e30f6c8df05f26ada0a" || getDetails.userDetails.role === "63cb5e30f6c8df05f26ada0a") ? routes : homeRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {/* {configsButton} */}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
          {((getDetails.userDetails.role === "63cb5e30f6c8df05f26ada0a") && getRoutes(routes) )}
          {/* {getRoutes(routes)} */}
            <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
          </Routes>
        </ThemeProvider>
      </CacheProvider>
    
  ) : (
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
          {(getDetails.userDetails.role === "63cb5e30f6c8df05f26ada0a") &&
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Jeevan Khata"
              routes={(detailUser.role === "63cb5e30f6c8df05f26ada0a" || getDetails.userDetails.role === "63cb5e30f6c8df05f26ada0a") ? routes : homeRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />}
            <Configurator />
            {/* {configsButton} */}
          </>
        )}

         {layout === "login" && <Configurator />}
        <Routes>
        {((getDetails.userDetails && (getDetails.userDetails.role === "63cb5e30f6c8df05f26ada0a")) && getRoutes(routes) )}
        {/* {getRoutes(routes)} */}
        {!cookieValue ? 
          <Route path="*" element={<SignIn />} />
          :
          !pathname || pathname === "/" ?
          <Route path="*" element={<Navigate to="/adminDashboard" />} />
          :
          <Route path="*" element={<Navigate to={pathname} />} />
          }
        </Routes>
      </ThemeProvider>
    
  );
} 
