import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import EditSharpIcon from '@mui/icons-material/EditSharp';

export default function DeletedUsers() {

  const [deletedData, setdeletedUsersData] = useState([]);

  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "Name", accessor: "name",align: "center" },
      { Header: "Designation", accessor: "designation",align: "center" },
      { Header: "Email ID", accessor: "email", align: "center"},
      { Header: "Mobile No.", accessor: "mobile", align: "center"},
      { Header: "Gender", accessor: "gender", align: "center"},
      { Header: "Trading Exp.", accessor: "tradingexp",align: "center" },
      { Header: "Location", accessor: "location",align: "center" },
      { Header: "Date of Joining", accessor: "doj", align: "center"},
      { Header: "Role", accessor: "role", align: "center"},
      { Header: "Status", accessor: "status", align: "center"},
    ],

    rows: [],
  };
}