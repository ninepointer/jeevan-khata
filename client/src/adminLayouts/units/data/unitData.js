
export default function UnitsData() {

  return {
    // table header data declaration
    columns: [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Unit Name", accessor: "unitname", align: "center" },
        { Header: "Unit Id", accessor: "unitid", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },  
        { Header: "Created On", accessor: "createdon", align: "center" },     
      ],

      rows: []

  };
}
