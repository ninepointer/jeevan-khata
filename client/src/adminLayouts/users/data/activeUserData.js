
// Images

export default function AllActiveUsers() {

    //Grid Headers for User Table
      return {
        columns: [
          { Header: "Edit", accessor: "edit",align: "center" },
          { Header: "JeevanKhata ID", accessor: "jeevankhataId",align: "center" },
          { Header: "first name", accessor: "firstName",align: "center" },
          { Header: "last name", accessor: "lastName",align: "center" },
          { Header: "Email", accessor: "email", align: "center"},
          { Header: "Mobile No.", accessor: "mobile", align: "center"},
          { Header: "Gender", accessor: "gender", align: "center"},
          { Header: "DOB", accessor: "dateOfBirth",align: "center" },
          { Header: "City", accessor: "city",align: "center" },
          { Header: "State", accessor: "state", align: "center"},
          { Header: "Role", accessor: "role", align: "center"},
          { Header: "Created On", accessor: "createdOn", align: "center"},
        ],
    
        rows: [],
      };
    }