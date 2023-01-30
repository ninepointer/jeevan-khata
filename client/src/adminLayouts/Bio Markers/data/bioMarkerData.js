
export default function BioMarkerData() {

  return {
    // table header data declaration
    columns: [
        { Header: "View", accessor: "view", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Unit", accessor: "unit", align: "center" },
        { Header: "Scientific Name", accessor: "scientificName", align: "center" },
        { Header: "# BioMarker Type", accessor: "bioMarkerTypeCount", align: "center" },
        { Header: "Created On", accessor: "createdOn", align: "center" },
      ],

      rows: []

  };
}
