// import { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import HorizontalTabBar from "./horizontal-tab";
import { AttributeFileID, AttributeFolderID } from "../pages/home-page";
import { getData } from "../utils/requestUtils";
import { Editable } from "./file-structure";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
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
    {
      path: "message.issue.category",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "ITEM",
      description: "Identifies what is the category of this issue",
    },
    {
      path: "message.issue.sub_catagory",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "ITEM01",
      description: "Identifies what is the sub-category of this issue",
    },
    {
      path: "message.issue.complainant_info.person.name",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "Rishabh",
      description:
        "Describes the name of a person in format: ./{given_name}/{honorific_prefix}/{first_name}/{middle_name}/{last_name}/{honorific_suffix}",
    },
    {
      path: "message.issue.complainant_info.contact.phone",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: 87999347636,
      description: "Describes the contact",
    },
    {
      path: "message.issue.complainant_info.contact.email",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "risha.singla@gmail.com",
      description: "Describes the email",
    },
    {
      path: "message.issue.order_details.id",
      required: "Optional",
      type: "String",
      owner: "BAP",
      usage: "wtewetydug",
      description:
        "the value of this field will be the combination of context.transaction_id and order.id.",
    },
    {
      path: "message.issue.order_details.state",
      required: "Optional",
      type: "String",
      owner: "BAP",
      usage: "Completed",
      description: "Describes the state",
    },
    {
      path: "message.issue.order_details.items.id",
      required: "Optional",
      type: "String",
      owner: "BAP",
      usage: 1123456677,
      description:
        "the value of this field will be the combination of context.transaction_id and order.id.",
    },
    {
      path: "message.issue.order_details.items.quantity",
      required: "Optional",
      type: "String",
      owner: "BAP",
      usage: 6,
      description: "describes the quantity of the ordere",
    },
    {
      path: "message.issue.order_details.fulfillments.id",
      required: "Optional",
      type: "String",
      owner: "BAP",
      usage: "eufhruefhe12344",
      description: "describes the fulfillment states id ",
    },
    {
      path: "message.issue.order_details.fulfillments..state",
      required: "Optional",
      type: "String",
      owner: "BAP",
      usage: "Delevered",
      description: "describes the fulfillment states ",
    },
    {
      path: "message.issue.order_details.provider_id",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "MR8mcezPPQEA-r8EhP6UN9",
      description: "describes the provider id",
    },
    {
      path: "message.issue.descriptor.short_desc",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "Item quality",
      description: "Short description about issue",
    },
    {
      path: "message.issue.descriptor.long_desc",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "Item quality is not good",
      description: "Long description about issue",
    },
    {
      path: "message.issue.descriptor.additional_desc.url",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: false,
      description: "Additional description of url",
    },
    {
      path: "message.issue.descriptor.additional_desc.content_type",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "fhdjfhndj",
      description: "Additional description of content type",
    },
    {
      path: "message.issue.description.image",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage:
        '"https://storage.googleapis.com/adya_upload_pdf/image/file-df7ea687-448d-464d-bf1f-4a23707beadf.png"',
      description: "Image description",
    },
    {
      path: "message.issue.source.network_participant_id",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "buyer-app-preprod-v2.ondc.org",
      description: "describes about participant id",
    },
    {
      path: "message.issue.source.type",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "Consumer",
      description: "describes about source type ",
    },
    {
      path: "message.issue.expected_response_time.duration",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "PT2H",
      description:
        "\t\n" +
        "Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations",
    },
    {
      path: "message.issue.expected_resolution_time.duration",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "P2D",
      description:
        "\t\n" +
        "Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations",
    },
    {
      path: "message.issue.status",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "OPEN",
      description: "describe issue status",
    },
    {
      path: "message.issue.issue_type",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: false,
      description: "descibe issue type",
    },
    {
      path: "message.issue.issue_action.complainant_actions.complainant_action",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: false,
      description:
        "Describes the action taken by the complainant who has raised the issue. the value should be populated when the complainant has taken any of the below actions to anotate the action taken. the actions can be,action",
    },
    {
      path: "message.issue.issue_action.complainant_actions.short_desc",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: false,
      description:
        "details of the remarks when the issue status is changed, can be captured when the complainant triggers an action",
    },
    {
      path: "message.issue.issue_action.complainant_actions.updated_at",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "2023-12-19T05:39:05.893Z",
      description: "Short description about issue",
    },
    {
      path: "message.issue.issue_action.complainant_actions.updated_by.org.name",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: 'buyer-app-preprod-v2.ondc.org::ONDC:RET10"',
      description: "Describes an organization",
    },
    {
      path: "message.issue.issue_action.complainant_actions.updated_by.contact.phone",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: 9963548006,
      description: "Describes a phone no",
    },
    {
      path: "message.issue.issue_action.complainant_actions.updated_by.contact.email",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "buyer@ondc.org",
      description: "Describe the email",
    },
    {
      path: "message.issue.issue_action.complainant_actions.updated_by.person.name",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "Buyer Admin",
      description: "Describe the person name ",
    },
    {
      path: "message.issue.created_at",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "2023-12-19T05:39:05.893Z",
      description: "timestamp for the creation of the issue",
    },
    {
      path: "message.issue. updated_at",
      required: "mandatory",
      type: "String",
      owner: "BAP",
      usage: "2023-12-19T05:39:05.893Z",
      description:
        "timestamp for the capturing the time an issue was last updated",
    },
  ],
};

const AttributesTable = ({ path }: { path: string }) => {
  const [activeFile, setActiveFile] = useState("");
  const [activeTable, setActiveTable] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileData, setFileData] = useState({}); // Data for the selected file

  const tabRef = React.useRef(0);
  const data = n.nodes;
  useEffect(() => {
    const fetchData = GetFiles(setFiles, setActiveFile, tabRef, path);
    fetchData();
  }, []);
  useEffect(() => {
    (async () => {
      await getTableData(activeFile);
    })();
  }, [activeFile]);
  let tableNames: string[] = [];
  async function getTableData(fileName: string) {
    // Fetch data for the selected table
    const tData = await getData(`cpo/attributes/${fileName}`);
    setFileData(tData);
  }
  function getTableNames() {
    const tableNames = [];
    for (let key in fileData) {
      tableNames.push(key);
    }
    console.log("tableNames", tableNames);
    return tableNames;
  }
  return (
    <div className="mt-3 ml-3 max-w-full">
      <div className="flex w-full">
        <div className="flex-1">
          <HorizontalTabBar
            items={files}
            editable={{
              registerID: AttributeFileID,
              name: activeFile,
              path: `cpo/attributes/${activeFile}`,
            }}
            setSelectedItem={(item: string) => {
              setActiveFile(item);
              tabRef.current = files.indexOf(item);
            }}
            selectedItem={activeFile}
            onOpen={GetFiles(setFiles, setActiveFile, tabRef, path)}
          />
        </div>
        <div className="flex-1">
          <HorizontalTabBar
            items={getTableNames()}
            editable={{
              registerID: AttributeFileID,
              name: activeFile,
              path: `${path}/${activeFile}`,
              query: { type: "addRow", sheet: activeTable },
            }}
            setSelectedItem={setActiveTable}
            selectedItem={activeTable}
            onOpen={() => {}}
          />
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        {" "}
        {/* This div will handle horizontal scrolling if necessary */}
        <DataTable
          activeFile={activeFile}
          activeTable={activeTable}
          fileData={fileData}
        />
      </div>
    </div>
  );
};
export default AttributesTable;

function DataTable({
  activeFile,
  activeTable,
  fileData,
}: {
  activeFile: string;
  activeTable: string;
  fileData: any;
}) {
  const data = fileData[activeTable] || [];
  const headTooltip = useEditorToolTip([false, true, true]);
  headTooltip.data.current = {
    name: activeFile,
    registerID: AttributeFileID,
    path: `cpo/attributes/${activeFile}`,
    query: { type: "addRow", sheet: activeTable },
  } as Editable;

  return (
    <table className="w-full mt-2 border-collapse table-auto">
      <thead
        onContextMenu={headTooltip.onContextMenu}
        onMouseOver={headTooltip.onMouseOver}
        onMouseOut={headTooltip.onMouseOut}
      >
        <Tippy {...headTooltip.tippyProps}>
          <tr className="hover:bg-blue-200">
            {data.length > 0 &&
              Object.keys(data[0]).map((key, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left border-b-2 border-gray-200 "
                  style={{ minWidth: "120px", maxWidth: "200px" }} // Controlling column width
                >
                  {key.toUpperCase()}
                </th>
              ))}
          </tr>
        </Tippy>
      </thead>
      <tbody>
        {data.map((row: any, index: any) => (
          <TableRow index={index} row={row} sheetName={activeTable} />
        ))}
      </tbody>
    </table>
  );
}

function TableRow({ index, row, SheetName }: any) {
  // console.log("index", index);
  // row = index.row;
  const tooltip = useEditorToolTip([true, false, true]);
  tooltip.data.current = {
    name: SheetName,
    registerID: "ATTRIBUTE_FILE",
    path: `cpo/attributes/${SheetName}`,
    query: { type: "addRow", sheet: SheetName, rowData: row },
  } as Editable;
  return (
    <Tippy {...tooltip.tippyProps}>
      <tr
        key={index}
        onContextMenu={tooltip.onContextMenu}
        className=" hover:bg-blue-200"
      >
        {Object.values(row).map((value: any, idx) => (
          <td
            key={idx}
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

function GetFiles(
  setFiles: React.Dispatch<React.SetStateAction<string[]>>,
  setActiveFile: React.Dispatch<React.SetStateAction<string>>,
  tabRef: React.MutableRefObject<number>,
  path: string
) {
  return async () => {
    const files = await getData(path);
    setFiles(files);
    setActiveFile(files[tabRef.current]);
  };
}
