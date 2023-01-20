export default function RoleData() {

  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Role Name", accessor: "roleName", align: "center" },
      { Header: "Report Access", accessor: "reportAccess", align: "center" },
      { Header: "User Access", accessor: "userAccess", align: "center" },
      { Header: "Attributes Access", accessor: "attrubitesAccess", align: "center" },
      { Header: "Analytics Access", accessor: "analyticsAccess", align: "center" },
      { Header: "Created On", accessor: "createdOn", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],

    rows: [],
  };
}