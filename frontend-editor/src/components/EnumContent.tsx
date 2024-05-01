import React from "react";
import { Editable } from "./file-structure";
import { Disclosure, Transition } from "@headlessui/react";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { CgMenuMotion } from "react-icons/cg";
import { GoRelFilePath } from "react-icons/go";
import { getData } from "../utils/requestUtils";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
const testEnums = [
  {
    path: "issue.message.issue.catagory",
    enums: [
      {
        code: "FULFILMENT",
        description:
          "Issues related to the timely and accurate disbursement of the loan.",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORDER",
        description:
          "Issues concerning the loan order and overall loan servicing issues.",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PAYMENT",
        description:
          "Issues pertaining to payments, interest, and charges associated with the loan provided to the borrower.",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
  {
    path: "issue.message.issue.sub-category",
    enums: [
      {
        code: "ORD01",
        description: "Incorrect info on the credit report",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD02",
        description: "delay in updating payment information",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD03",
        description: "Missing or lost loan documents",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD04",
        description: "Errors in loan agreements or contracts",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT202",
        description: "Issuance - Incorrect premium Amount",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT203",
        description: "Issuance - Payment related issues",
        reference: "<PR/Issue/Discussion] Links md format text",
      },
      {
        code: "PMT204",
        description: "Issuance - Refund amount mismatch",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT205",
        description: "Issuance - Renewal premium clarification",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT206",
        description: "Issuance - Auto Debit related clarification",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT207",
        description: "Issuance - TDS Certificate issuance",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT208",
        description: "Issuance - GSTIN",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PMT209",
        description: "Issuance - EMI Calculation",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD210",
        description: "Issuance -policy benefits & features",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD211",
        description:
          "Issuance -Result of Health Checkup / Manual verification of vehicle",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD212",
        description:
          "Issuance -Change /Correction of personal details Name, DOB, Address, PED etc",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD213",
        description: "Issuance -Addition of Family Member/New Born",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD214",
        description: "Issuance -Ownership Transfer",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD215",
        description: "Issuance -Customer Details",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD216",
        description: "Issuance -Vehicle Details Updation",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD217",
        description: "Issuance -Hypothecation update",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD218",
        description: "Issuance -Vahan Update",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD219",
        description: "Issuance -Addition or Removal of Add Ons",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD220",
        description:
          "Issuance -Policy Cancellation initiation and status - not able to cancel the policy",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD221",
        description: "Issuance -Claim Status",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD222",
        description: "Issuance -Portal Issues",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD223",
        description: "Issuance - Delay in Claim processing",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD224",
        description: "Issuance -Claim Repudiation",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD225",
        description: "Issuance -TPA Change during renewals",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ORD226",
        description: "Issuance - Nominee Updation",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM201",
        description:
          "Issuance - Policy Issuance Status policy document not received",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM202",
        description: "Not able to complete the KYC",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM203",
        description: "Not able to set up E-mandate",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM204",
        description: "OTP not received during the e-sign of agreement",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM205",
        description: "Not able to view the agreement",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM206",
        description: "Need to update the e-mandate details",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM207",
        description: "Feedback on collection call",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM208",
        description: "Stop Marketing Communications",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM209",
        description: "Request for documents",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM210",
        description: "Need to update personal details",
        reference: "<PR/Issue/Discussion Links md format text\\",
      },
      {
        code: "FLM211",
        description: "revoke consent already granted to collect personal data",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "FLM212",
        description: "delete/forget existing data against my profile",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
  {
    path: "issue.message.issue.order_details.state",
    enums: [
      {
        code: "GRANTED",
        description: "Issuance - Nominee Updation",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "PROCESSING",
        description: "Issuance - Nominee Updation",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "CLAIM_INITIATED",
        description: "Describes if claim has been initiated",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "CLAIM_PROCESSING",
        description: "Describes if claim is under process",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "CLAIM_PROCESSED",
        description: "Describes if claim has been processed",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "CLAIM_REJECTED",
        description: "Describes if claim has been rejected",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ONLINE_RENEW",
        description: "Describes if renewal is online",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "RENEWAL_PROCESSED",
        description: "Describes if renewal has been processed",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "RENEWAL_INITIATED",
        description: "Describes if renewal has been initiated",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "INSPECTION_SUCCESSFUL",
        description: "Describes if inspection has been successful",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "INSPECTION_REJECTED",
        description: "Describes if renewal has been rejected",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
  {
    path: "issue.message.issue.source.type",
    enums: [
      {
        code: "CONSUMER",
        description: "Describes if renewal has been rejected",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "INTERFACING NP",
        description: "Describes if renewal has been rejected",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "SELLER",
        description: "Describes if renewal has been rejected",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
  {
    path: "issue.message.issue.status",
    enums: [
      {
        code: "OPEN",
        description: "Describes the issue status",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "CLOSED",
        description: "Describes the issue status",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "RESOLVED",
        description: "Describes the issue status",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
  {
    path: "issue.message.issue.issue_type",
    enums: [
      {
        code: "ISSUE",
        description: "Describes the issue type",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "GRIEVANCE",
        description: "Describes the issue type",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "DISPUTE",
        description: "Describes the issue type",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
  {
    path: "issue.message.issue.issue_actions.complainant_actions.complainant_action",
    enums: [
      {
        code: "OPEN",
        description: "Describes the complainant_action",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "ESCALATE",
        description: "Describes the complainant_action",
        reference: "<PR/Issue/Discussion Links md format text",
      },
      {
        code: "CLOSE",
        description: "Describes the complainant_action",
        reference: "<PR/Issue/Discussion Links md format text",
      },
    ],
  },
];
interface Enum {
  code: string;
  description: string;
}
interface EnumData {
  path: string;
  enums: Enum[];
}
type EnumResponse = Record<string, EnumData[]>;
export function EnumContent({ enums }: { enums: Editable }) {
  const [enumData, setEnumData] = React.useState<EnumResponse>();
  enums.query.getData = getEnumsData;
  async function getEnumsData() {
    const data = await getData(enums.path);
    setEnumData(data);
  }
  React.useEffect(() => {
    getEnumsData();
  }, []);

  return (
    <>
      <div className="mt-3 ml-3 max-w-full pr-2">
        <div className="flex w-full">
          <div className="flex-1">
            {enumData &&
              Object.keys(enumData).map((apiName, index) => (
                <EnumDisclose
                  key={index}
                  apiName={apiName}
                  data={enumData[apiName]}
                  enumEditable={enums}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

function EnumDisclose({
  apiName,
  data,
  enumEditable,
}: {
  apiName: string;
  data: EnumData[];
  enumEditable: Editable;
}) {
  const apiToolTip = useEditorToolTip();

  const apiEidtable = { ...enumEditable };
  apiEidtable.name = apiName;
  apiEidtable.query = {
    getData: enumEditable.query.getData,
    Parent: enumEditable,
    addParams: { type: "enum" },
    deleteParams: {},
    updateParams: { oldName: apiName },
  };
  if (apiEidtable.query.deleteParams) {
    apiEidtable.query.deleteParams[apiName] = JSON.stringify([]);
  }
  apiToolTip.data.current = apiEidtable;

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className="flex items-center justify-between ml-2 mt-3 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-300 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg
          transition duration-300 ease-in-out"
            onContextMenu={apiToolTip.onContextMenu}
          >
            <Tippy {...apiToolTip.tippyProps}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <CgMenuMotion size={20} className="mr-2" />
                  <span>{apiName}</span>
                </div>
                {open ? (
                  <IoIosArrowDropdown size={25} />
                ) : (
                  <IoIosArrowDropright size={25} />
                )}
              </div>
            </Tippy>
          </Disclosure.Button>
          <DropTransition>
            <Disclosure.Panel>
              {data.map((t, i) => (
                <EnumList
                  key={i}
                  enumData={t}
                  index={i}
                  enumEditable={apiEidtable}
                />
              ))}
            </Disclosure.Panel>
          </DropTransition>
        </>
      )}
    </Disclosure>
  );
}

function EnumList({
  enumData,
  index,
  enumEditable,
}: {
  enumData: EnumData;
  index: number;
  enumEditable: Editable;
}) {
  const enumToolTip = useEditorToolTip([true, false]);
  const editable: Editable = {
    name: enumData.path.split(".").pop() || "",
    path: enumEditable.path,
    registerID: enumEditable.registerID,
    query: {
      getData: enumEditable.query.getData,
      Parent: enumEditable,
      addParams: { type: "enum" },
      deleteParams: {},
      updateParams: {},
    },
  };
  if (editable.query.deleteParams) {
    editable.query.deleteParams[enumEditable.name] = [
      { path: enumData.path, enums: enumData.enums },
    ];
  }
  if (editable.query.updateParams) {
    editable.query.updateParams = {
      path: enumData.path,
      enums: enumData.enums,
    };
  }
  enumToolTip.data.current = editable;
  return (
    <Disclosure key={index}>
      <Disclosure.Button
        className="flex ml-6 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
        onContextMenu={enumToolTip.onContextMenu}
      >
        <Tippy {...enumToolTip.tippyProps}>
          <div className="flex items-center">
            <GoRelFilePath size={20} className="mr-2" />
            <span>{enumData.path}</span>
          </div>
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-2 shadow-inner">
          <EnumTable enumList={enumData.enums} />
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}

function EnumTable({ enumList }: { enumList: Enum[] }) {
  enumList = enumList.map((e) => {
    const ob = { code: e.code, description: e.description };
    return ob;
  });
  const heads = ["code", "description"];
  return (
    <>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            {heads.map((key, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left border-b-2 border-gray-200 text-base"
                // style={{ minWidth: "100px", maxWidth: "200px" }}
              >
                {key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enumList.map((e, index) => (
            <tr key={index}>
              {Object.values(e)
                .filter((val) => val != "refrence")
                .map((value, i) => (
                  <td
                    key={i + value}
                    className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base"
                  >
                    {value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DropTransition({ children }: any) {
  return (
    <Transition
      enter="transition duration-200 ease-out"
      enterFrom="transform translate-y-1 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-1 opacity-0"
    >
      {children}
    </Transition>
  );
}
