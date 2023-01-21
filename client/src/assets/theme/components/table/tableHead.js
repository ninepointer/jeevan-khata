// Material Dashboard 2 React base styles
import borders from "../../base/borders";

// Material Dashboard 2 React helper functions
import pxToRem from "../../functions/pxToRem";

const { borderRadius } = borders;

const tableHead = {
  styleOverrides: {
    root: {
      display: "block",
      padding: `${pxToRem(8)} ${pxToRem(8)} 0  ${pxToRem(8)}`,
      borderRadius: `${borderRadius.xl} ${borderRadius.xl} 0 0`,
    },
  },
};

export default tableHead;
