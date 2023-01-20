
export default function BioMarkerData() {

  return {
    // table header data declaration
    columns: [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Unit", accessor: "unit", align: "center" },
        { Header: "Gender", accessor: "gender", align: "center" },
        { Header: "Age Group Start", accessor: "agegroupstart", align: "center" },
        { Header: "Age Group End", accessor: "agegroupend", align: "center" },
        { Header: "Age Group Unit", accessor: "agegroupunit", align: "center" },
        { Header: "Range", accessor: "range", align: "center" },
        { Header: "Body Condition", accessor: "bodycondition", align: "center" },        
      ],

      rows: []

  };
}
