// import { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import HorizontalTabBar from "./horizontal-tab";
import { AttributeFileID, AttributeFolderID } from "../pages/home-page";
import { deleteData, getData } from "../utils/requestUtils";
import { Editable } from "./file-structure";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import { AnimatePresence, motion } from "framer-motion";
const n = {
  nodes: [
    {
      path: "message.issue.id",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "7ed3b150-95c6-11ee-9475-039cd8109d56",
      description:
        "Network issue identifier is an unique number assigned to any complaint by the interfacing application at the source.",
    },
  ],
};

const AttributesTable = ({ attribute }: { attribute: Editable }) => {
  const [activeFile, setActiveFile] = useState("");
  const [activeTable, setActiveTable] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileData, setFileData] = useState<Record<string, any>>({});
  const tabRef = React.useRef(0);

  attribute.query.getData = getAttributesData;

  useEffect(() => {
    getAttributesData();
  }, []);

  useEffect(() => {
    (async () => {
      await getTableData(activeFile);
    })();
  }, [activeFile]);

  async function getAttributesData() {
    const files: string[] = await getFileNames();
    getTableData(files[0]);
    if (files.length > 0) {
      setActiveFile(files[0]);
    } else {
      setActiveFile("");
      setActiveTable("");
    }
    // if(file)
    // // setActiveFile("");
    // // setActiveTable("");
  }

  async function getFileNames() {
    const files: string[] = await getData(attribute.path);
    setFiles(files);
    return files;
  }

  async function getTableData(fileName: string) {
    const tData = await getData(`${attribute.path}/${fileName}`);
    setFileData(tData);
    if (Object.keys(tData).length > 0) {
      setActiveTable(Object.keys(tData)[0]);
    }
  }

  function getTableNames() {
    const tableNames = [];
    for (let key in fileData) {
      tableNames.push(key);
    }
    return tableNames;
  }

  const fileEditable: Editable = {
    name: activeFile,
    registerID: attribute.registerID,
    path: `${attribute.path}/${activeFile}`,
    deletePath: attribute.path,
    query: {
      getData: () => attribute.query.getData(),
      Parent: attribute.query.Parent,
      deleteParams: { folderName: activeFile },
      copyData: async () => {
        return JSON.stringify(fileData, null, 2);
      },
    },
  };
  const tableEditable: Editable = {
    name: activeTable,
    registerID: AttributeFileID,
    path: `${attribute.path}/${activeFile}`,
    deletePath: `${attribute.path}/${activeFile}`,
    query: {
      getData: () => getTableData(activeFile),
      Parent: attribute,
      updateParams: { getTableNames },
      deleteParams: {},
      copyData: async () => {
        const table = fileData[activeTable];
        const copy: Record<string, any> = {};
        copy[activeTable] = table;
        return JSON.stringify(copy, null, 2);
      },
    },
  };
  if (tableEditable.query.deleteParams)
    tableEditable.query.deleteParams[activeTable] = fileData[activeTable] || [];
  return (
    <div className="mt-3 ml-3 max-w-full">
      <div className="flex w-full">
        <div className="flex-1">
          <HorizontalTabBar
            items={files}
            editable={fileEditable}
            setSelectedItem={(item: string) => {
              setActiveFile(item);
              tabRef.current = files.indexOf(item);
              getTableData(item);
              setActiveTable("");
            }}
            selectedItem={activeFile}
            onOpen={getFileNames}
          />
        </div>
        <div className="flex-1">
          <HorizontalTabBar
            items={getTableNames()}
            editable={tableEditable}
            setSelectedItem={setActiveTable}
            selectedItem={activeTable}
            onOpen={getTableNames}
            editOrders={[true, true, false]}
          />
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          key={activeTable + activeFile}
          style={{ overflowX: "auto" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            key={activeTable}
            activeFile={activeFile}
            activeTable={activeTable}
            fileData={fileData}
            editable={tableEditable}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default AttributesTable;

function DataTable({
  activeTable,
  fileData,
  editable,
}: {
  activeFile: string;
  activeTable: string;
  fileData: any;
  editable: Editable;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const data = fileData[activeTable] || [];

  const headTooltip = useEditorToolTip([false, true, true]);
  headTooltip.data.current = {
    name: editable.name,
    registerID: editable.registerID,
    path: editable.path,
    deletePath: editable.path,
    query: {
      getData: editable.query?.getData,
      Parent: editable.query.Parent,
      addParams: { type: "addRow", sheet: activeTable },
      deleteParams: { sheetName: activeTable },
      copyData: async () => {
        const table = fileData[activeTable];
        const copy: Record<string, any> = {};
        copy[activeTable] = table;
        return JSON.stringify(copy, null, 2);
      },
    },
  };

  const filteredData = data.filter((row: any) =>
    Object.values(row).some((val: any) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="w-full mt-2">
      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-400 bg-gray-100 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition duration-200"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="w-full border-collapse table-auto">
        <thead
          onContextMenu={headTooltip.onContextMenu}
          onMouseOver={headTooltip.onMouseOver}
          onMouseOut={headTooltip.onMouseOut}
        >
          <Tippy {...headTooltip.tippyProps}>
            <tr className="hover:bg-blue-200">
              {activeTable != "" &&
                Object.keys(data[0] || {}).map((key, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-left border-b-2 border-gray-200"
                    style={{ minWidth: "120px", maxWidth: "200px" }}
                  >
                    {key.toUpperCase()}
                  </th>
                ))}
            </tr>
          </Tippy>
        </thead>
        <tbody>
          {filteredData.map((row: any, index: any) => (
            <TableRow
              index={index}
              row={row}
              sheetName={activeTable}
              editable={editable}
              key={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({
  index,
  row,
  sheetName,
  editable,
}: {
  index: number;
  row: any;
  sheetName: string;
  editable: Editable;
}) {
  const tooltip = useEditorToolTip([true, false, true]);
  tooltip.data.current = {
    name: editable.name,
    registerID: editable.registerID,
    path: editable.path,
    deletePath: editable.path,
    query: {
      Parent: editable.query.Parent,
      getData: () => editable.query.getData(),
      addParams: { type: "addRow", sheet: sheetName, rowData: row },
      deleteParams: {},
      copyData: async () => {
        const copy: Record<string, any> = {};
        copy[sheetName] = [row];
        return JSON.stringify(copy, null, 2);
      },
    },
  };
  if (tooltip.data.current.query.deleteParams)
    tooltip.data.current.query.deleteParams[sheetName] = [row];
  return (
    <Tippy {...tooltip.tippyProps}>
      <tr
        key={index}
        onContextMenu={tooltip.onContextMenu}
        className=" hover:bg-blue-200"
      >
        {Object.values(row).map((value: any, idx) => (
          <td
            key={idx + value}
            className="px-4 py-2 text-left border-b border-gray-200 align-top break-words"
            style={{ maxWidth: "200px" }} // Prevents cell from expanding too much
          >
            {value}
          </td>
        ))}
      </tr>
    </Tippy>
  );
}
