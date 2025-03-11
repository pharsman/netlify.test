import Grid from "masterComponents/Grid";
import Tag from "masterComponents/Tag";

import ruru from "@/assets/icons/grid/Small.png";

import { devExtremeTest } from "@/api/api";
import { useEffect, useState } from "react";

const columns = [
  {
    columnKey: "VacancyID",
    columnName: "ID",
    dataType: "string",
    width: "80px",
  },
  {
    columnKey: "JobName",
    columnName: "State",
    dataType: "string",
    // group: true,
  },
  {
    dataType: "string",
    columnKey: "UnitHead",
    columnName: "Company Name",
    group: true,
  },
  // {
  //   dataType: "date",
  //   columnKey: "Date",
  //   columnName: "Date",
  // },
  // {
  //   columnKey: "City",
  //   columnName: "City",
  //   dataType: "string",
  // },
  // {
  //   columnKey: "Zipcode",
  //   columnName: "Zipcode",
  //   dataType: "string",
  //   template: () => (
  //     <div style={{ overflow: "hidden", height: "24px" }}>
  //       <img src={ruru} alt="ss" style={{ width: "24px" }} />
  //     </div>
  //   ),
  // },
  // {
  //   columnKey: "Phone",
  //   columnName: "Phone",
  //   dataType: "string",
  // },
];

const Questionnaires = () => {
  const [check, setCheck] = useState();

  const test = async () => {
    const resp = await devExtremeTest();
    setCheck(resp.data.data);
    console.log(resp.data);
  };

  useEffect(() => {
    test();
  }, []);

  return (
    <div style={{ margin: "50px", height: "80vh" }}>
      <Grid
        customColumns={columns}
        withCustomActions={true}
        onDelete={(rowData) => console.log(rowData)}
        onEdit={(rowData) => console.log(rowData)}
        withCustomStore={false}
        // loadFunction={(options) => check(options)}
        storeKey={"VacancyID"}
        // withMasterDetail={true}
        // detailTemplate={ExpandComponent}
        keyExpr={"VacancyID"}
        filterOptions={{ headerFilter: true, filterRow: false }}
        scrollMode={"none"}
        withGrouping={true}
        groupDefaultCollapsed={true}
        height="100%"
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `3px solid ${e?.data?.Color}`;
        }}
        data={check}
        // pagerOptions={{ defaultPageSize: 4 }}
      />
    </div>
  );
};

export default Questionnaires;
