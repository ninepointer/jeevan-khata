
export default function fileUploadTableData() {

    return {
      // table header data declaration date
      columns: [
          { Header: "Name", accessor: "name", align: "center" },
          { Header: "Gender", accessor: "gender", align: "center" },
          { Header: "Age", accessor: "age", align: "center" },
          // { Header: "Test Name", accessor: "testName", align: "center" },
          // { Header: "Hospital", accessor: "hospital", align: "center" },  
          { Header: "Date of Report", accessor: "date", align: "center" },  
          { Header: "Details", accessor: "details", align: "center" },     
        ],
  
        rows: []
  
    };
  }
  