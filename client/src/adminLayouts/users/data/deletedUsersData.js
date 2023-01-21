export default function DeletedUsers() {

  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "First Name", accessor: "name",align: "center" },
      { Header: "Last Name", accessor: "designation",align: "center" },
      { Header: "Email", accessor: "email", align: "center"},
      { Header: "Mobile", accessor: "mobile", align: "center"},
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