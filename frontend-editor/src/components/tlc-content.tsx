import React, { useEffect, useState } from "react";
import { Editable } from "./file-structure";
import { getData } from "../utils/requestUtils";
import FullPageLoader from "./loader";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";

const EXAMPLE_DATA_FORMAT = {
  codes: [
    {
      Term: "text",
      Api: "text",
      Attribute: "text",
      Owner: "text",
      Value: "text",
      Description: "text",
    },
  ],
};

interface TLC_ROW {
  Term: string;
  Api: string;
  Attribute: string;
  Owner: string;
  Value: string;
  Description: string;
}

export function TlcContent({ tlcEditable }: { tlcEditable: Editable }) {
  const [tlc, setTlc] = React.useState<TLC_ROW[]>([]);
  const [timeout, setTimeout] = React.useState<boolean>(false);
  async function getTlcData() {
    const data = await getData(tlcEditable.path);
    console.log("getTlcData", data);
    setTlc(data?.code ?? []);
    console.log("tlc", data);
  }

  tlcEditable.query.getData = getTlcData;
  useEffect(() => {
    getTlcData();
  }, []);
  if (tlc === null) return <FullPageLoader />;
  return (
    <div>
      <DataTable tlcData={tlc} tlcEditable={tlcEditable} />
    </div>
  );
}

function DataTable({
  tlcData,
  tlcEditable,
}: {
  tlcData: TLC_ROW[];
  tlcEditable: Editable;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(tlcData, "tlcData");
  const filteredData = tlcData.filter((row: any) =>
    Object.values(row).some((val: any) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const headTooltip = useEditorToolTip([false, true, true]);

  headTooltip.data.current = {
    name: tlcEditable.name,
    registerID: tlcEditable.registerID,
    path: tlcEditable.path,
    deletePath: tlcEditable.path,
    query: {
      getData: tlcEditable.query?.getData,
      Parent: tlcEditable.query.Parent,
      copyData: async () => {
        const copy = {
          ID: tlcEditable.registerID,
          name: tlcEditable.name,
          rows: tlcData,
        };
        return JSON.stringify(copy, null, 2);
      },
    },
  };

  return (
    <div className="w-full mt-2">
      <input
        type="text"
        className=" w-full p-2 mb-4 ml-1 mt-1 border border-gray-400 bg-gray-100 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition duration-200"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="w-full border-collapse table-auto">
        <thead>
          <Tippy {...headTooltip.tippyProps}>
            <tr
              className="hover:bg-blue-200"
              onContextMenu={headTooltip.onContextMenu}
            >
              {Object.keys(EXAMPLE_DATA_FORMAT.codes[0]).map((key, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left border-r-2 border-b-2 border-gray-200"
                  style={{ minWidth: "120px", maxWidth: "200px" }}
                >
                  {key}
                </th>
              ))}
            </tr>
          </Tippy>
        </thead>
        <tbody>
          {filteredData.map((row: any, index: any) => (
            <TableRow index={index} row={row} editable={tlcEditable} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({
  index,
  row,
  editable,
}: {
  index: number;
  row: TLC_ROW;
  editable: Editable;
}) {
  const rowTooltip = useEditorToolTip([true, false, true]);
  rowTooltip.data.current = {
    name: editable.name,
    registerID: editable.registerID,
    path: editable.path,
    deletePath: editable.path,
    query: {
      getData: editable.query?.getData,
      Parent: editable,
      updateParams: {
        data: row,
      },
      deleteParams: {
        folderName: "tlc",
        rows: [row],
      },
      copyData: async () => {
        const copy = {
          ID: editable.registerID,
          name: editable.name,
          rows: [row],
        };
        return JSON.stringify(copy, null, 2);
      },
    },
  };
  return (
    <Tippy {...rowTooltip.tippyProps}>
      <tr
        key={index}
        className=" hover:bg-blue-200"
        onContextMenu={rowTooltip.onContextMenu}
      >
        <td className={tdStyle}>{row.Term}</td>
        <td className={tdStyle}>{row.Api}</td>
        <td className={tdStyle}>{row.Attribute}</td>
        <td className={tdStyle}>{row.Owner}</td>
        <td className={tdStyle}>{row.Value}</td>
        <td className={tdStyle}>{row.Description}</td>
      </tr>
    </Tippy>
  );
}
const tdStyle = `px-6 py-3 text-left border-b border-r border-gray-300 text-sm font-medium text-gray-700`;

function validTlcData(tlcData: any) {
  if (tlcData === null) return false;
  if (tlcData === "") return false;
  return true;
}
