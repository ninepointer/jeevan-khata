
export default function LabTestsData() {

    return {
      // table header data declaration
      columns: [
          { Header: "Edit", accessor: "edit", align: "center" },
          { Header: "Test Name", accessor: "testName", align: "center" },
          { Header: "Scientific Name", accessor: "testScientificName", align: "center" },
          { Header: "Status", accessor: "status", align: "center" },  
          { Header: "Created On", accessor: "createdOn", align: "center" },     
        ],
  
        rows: []
  
    };
  }
  