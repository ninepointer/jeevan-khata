
// Images

export default function AllActiveUsers() {

//Grid Headers for User Table
  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "JeevanKhata ID", accessor: "jeevankhataid",align: "center" },
      { Header: "first name", accessor: "fname",align: "center" },
      { Header: "last name", accessor: "lname",align: "center" },
      { Header: "Email", accessor: "email", align: "center"},
      { Header: "Mobile No.", accessor: "mobile", align: "center"},
      { Header: "Gender", accessor: "gender", align: "center"},
      { Header: "DOB", accessor: "dob",align: "center" },
      { Header: "City", accessor: "city",align: "center" },
      { Header: "State", accessor: "state", align: "center"},
      { Header: "Role", accessor: "role", align: "center"},
      { Header: "Created On", accessor: "createdon", align: "center"},
    ],

    rows: [],
  };
}