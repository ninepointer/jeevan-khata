// Material Dashboard 2 React base styles
import borders from "../../base/borders";
import colors from "../../base/colors";

// Material Dashboard 2 React helper functions
import pxToRem from "../../functions/pxToRem";

const { borderWidth } = borders;
const { light } = colors;

const tableCell = {
  styleOverrides: {
    root: {
      padding: `${pxToRem(6)} ${pxToRem(8)}`,
      borderBottom: `${borderWidth[1]} solid ${light.main}`,
    },
  },
};

export default tableCell;
