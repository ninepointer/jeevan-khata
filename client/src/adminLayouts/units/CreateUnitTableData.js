
export default function CreateUnitTableData() {

    return {
      // table header data declaration
      columns: [
          { Header: "Delete", accessor: "delete", align: "center" },
          { Header: "Conversion Unit FullName", accessor: "cunitfullname", align: "center" },
          { Header: "Conversion Unit Id", accessor: "cunitid", align: "center" },
          { Header: "Value", accessor: "value", align: "center" },    
        ],
  
        rows: []
  
    };
  }
  