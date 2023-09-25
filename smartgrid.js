const smartgrid = require("smartgrid-fixed");

const settings = {
  outputStyle: "scss", // less, scss, sass, styl
  columns: 12, // grid columns
  offset: "20px", // gutter width: px, %, rem
  mobileFirst: false, // 'min-width' : 'max-width'
  container: {
    maxWidth: "1410px",
    fields: "30px", // side fields
  },
  breakPoints: {
    lg: {
      width: "1366px" /* -> @media (max-width: 769px to 1024px) */,
    },
    md: {
      width: "1024px" /* -> @media (max-width: 769px to 1024px) */,
    },
    sm: {
      width: "768px" /* -> @media (max-width: 576px to 768px) */,
      fields:
        "15px" /* set fields only if you want to change container.fields */,
    },
    xs: {
      width: "575px" /* -> @media (max-width: 320px to 575px) */,
    },
    // We can create any quantity of break points.
    /*
    some_name: {
      width: 'Npx',
      fields: 'N(px|%|rem)',
      offset: 'N(px|%|rem)'
    }
    */
  },
};

smartgrid("./src/scss/components/", settings);
