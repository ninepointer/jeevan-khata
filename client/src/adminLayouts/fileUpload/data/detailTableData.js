
export default function detailTableData() {

    return {
      // table header data declaration
      columns: [
          { Header: "Bio Marker Name", accessor: "bioMarkerName", align: "center" },
          { Header: "Result", accessor: "result", align: "center" },
          { Header: "Range", accessor: "range", align: "center" },
          { Header: "Unit", accessor: "unit", align: "center" },
          // { Header: "Hospital", accessor: "hospital", align: "center" },  
          // { Header: "Details", accessor: "details", align: "center" },     
        ],
  
        rows: []
  
    };
  }
