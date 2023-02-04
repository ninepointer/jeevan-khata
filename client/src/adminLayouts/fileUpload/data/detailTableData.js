
export default function detailTableData() {

    return {
      // table header data declaration
      columns: [
          { Header: "Bio Marker Name", accessor: "name", align: "center" },
          { Header: "Value", accessor: "gender", align: "center" },
          { Header: "Range", accessor: "age", align: "center" },
          { Header: "Unit", accessor: "testName", align: "center" },
          // { Header: "Hospital", accessor: "hospital", align: "center" },  
          // { Header: "Details", accessor: "details", align: "center" },     
        ],
  
        rows: []
  
    };
  }
  