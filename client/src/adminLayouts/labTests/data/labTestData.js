
export default function LabTestsData() {

    return {
      // table header data declaration
      columns: [
          { Header: "View", accessor: "view", align: "center" },
          { Header: "Test Name", accessor: "testName", align: "center" },
          { Header: "Scientific Name", accessor: "testScientificName", align: "center" },
          { Header: "# Bio Marker", accessor: "biomarkers", align: "center" },
          { Header: "Status", accessor: "status", align: "center" },  
          { Header: "Created On", accessor: "createdOn", align: "center" },     
        ],
  
        rows: []
  
    };
  }
  