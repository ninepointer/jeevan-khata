
export default function UnitsData() {

  return {
    // table header data declaration
    columns: [
        { Header: "View", accessor: "view", align: "center" },
        { Header: "Unit Name", accessor: "unitname", align: "center" },
        { Header: "Unit Id", accessor: "unitid", align: "center" },
        { Header: "# Unit Conversion", accessor: "unitConversion", align: "center" },  
        { Header: "Status", accessor: "status", align: "center" },  
        { Header: "Created On", accessor: "createdon", align: "center" },     
      ],

      rows: []

  };
}
