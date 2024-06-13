import axios from "axios";
import { GlobalEditMode } from "../utils/config";
import { Listbox, Transition } from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";
import { BiCheck, BiDownload, BiTerminal } from "react-icons/bi";
import { FaExclamationCircle, FaGithub, FaUndo } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import { DataContext } from "../context/dataContext";
import ReusableModal from "./ui/generic-modal";
import JsonView from "@uiw/react-json-view";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:1000";

export function GitActionsTab({}) {
  const ActiveState = (localStorage.getItem("repoLink") as string) !== "-1";
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [selected, setSelected] = useState<{ id: number; name: string }>();
  const [action, setAction] = useState("status"); // ["status","reset","openPR"
  const [url, setUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const dataContext = React.useContext(DataContext);
  const [jsonValue, setJsonValue] = useState({ loading: "loading...." });
  useEffect(() => {
    if (!ActiveState) {
      return;
    }
    axios.get(`${baseUrl}/git/branches`).then((res) => {
      console.log(res);
      const data: { allBranches: string[]; currentBranch: string } = res.data;
      const branchList = data.allBranches.map(
        (branch: string, index: number) => {
          return { id: index, name: branch };
        }
      );

      console.log(data.currentBranch, branchList);
      const curr = branchList.find(
        (branch) => branch.name === "remotes/" + data.currentBranch
      ) ?? { id: 1, name: "loading" };
      console.log(curr);
      setBranches(branchList);
      setSelected(curr);
      setUrl(
        convertBranchToUrl(
          localStorage.getItem("repoLink") as string,
          curr.name
        )
      );
    });
  }, []);

  useEffect(() => {
    if (!ActiveState) return;
    async function changeBranch() {
      if (!selected) return;
      try {
        dataContext.setLoading(true);
        await axios.post(`${baseUrl}/git/changeBranch`, {
          branchName: selected.name,
        });
        dataContext.setLoading(false);
        dataContext.setReload((s) => !s);
      } catch (err) {
        dataContext.setLoading(false);
        console.error("Error changing branch:", err);
      }

      setUrl(
        convertBranchToUrl(
          localStorage.getItem("repoLink") as string,
          selected.name
        )
      );
    }
    // dataContext.setLoading(true);
    changeBranch();
    // dataContext.setLoading(false);
  }, [selected]);

  async function requestReset() {
    try {
      setModalOpen(false);
      dataContext.setLoading(true);
      await axios.delete(`${baseUrl}/git/reset`);
      dataContext.setLoading(false);
      dataContext.setReload((s) => !s);
    } catch (err) {
      dataContext.setLoading(false);
      console.error("Error resetting branch:", err);
    }
  }

  async function handleStatusClick() {
    dataContext.setLoading(true);
    const value = await axios.get(`${baseUrl}/git/status`);
    setJsonValue(value.data);
    dataContext.setLoading(false);
    setModalOpen(true);
    setAction("status");
  }

  const downloadFile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/local/download`, {
        responseType: "blob", // important to receive the response as a blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "download.zip"); // specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Downloading....");
    } catch (error) {
      console.error("Error downloading the file", error);
      toast.error("Download Failed!");
    }
  };

  const handleTerminalClick = async () => {
    try {
      axios.get(`${baseUrl}/local/terminal`);
      toast.success("Terminal opened successfully");
    } catch (err) {
      console.error("Error opening terminal:", err);
      toast.error("Error opening terminal");
    }
  };

  if (!selected && ActiveState) return <>loading</>;
  return (
    <>
      <div className="flex flex-row h-14 w-full bg-slate-200 fixed top-20 z-10 border-b-2 border-t-2 border-gray-500">
        <div className="flex items-center justify-between w-full px-4">
          {ActiveState && (
            <div className=" flex items-start">
              <BranchListBox
                branches={branches}
                selected={selected ? selected : { id: 1, name: "loading" }}
                onChange={
                  setSelected as React.Dispatch<
                    React.SetStateAction<{ id: number; name: string }>
                  >
                }
              />
              <div className="relative inline-block text-left mt-2 ml-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  OPEN IN GITHUB
                </a>
              </div>
            </div>
          )}
          {!ActiveState && (
            <div className="flex items-start w-full">
              <h1 className="text-xl font-bold">
                Editing Uploaded Component Folder
              </h1>
            </div>
          )}
          <div className="flex items-center space-x-2">
            {GlobalEditMode && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTerminalClick}
                  className="flex items-center text-sm font-medium px-4 py-2 text-black transition duration-200 border-2 border-black hover:bg-black hover:text-white"
                >
                  <BiTerminal className="mr-2" size={20} />
                  CMD
                </button>
                {ActiveState && (
                  <>
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setAction("reset");
                      }}
                      className="flex items-center text-sm font-medium px-4 py-2 text-red-600 transition duration-200 border-2 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <FaUndo className="mr-2" size={20} />
                      RESET
                    </button>
                    <button
                      onClick={handleStatusClick}
                      className="flex items-center px-4 py-2 text-yellow-600 text-sm font-medium transition duration-200 border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white"
                    >
                      <FaExclamationCircle className="mr-2" size={20} />
                      STATUS
                    </button>
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setAction("OPEN PR");
                      }}
                      className="flex items-center px-4 py-2 text-green-600 text-sm font-medium transition duration-200 border-2 border-green-600 hover:bg-green-600 hover:text-white"
                    >
                      <FaGithub className="mr-2" size={20} />
                      OPEN_PR
                    </button>
                  </>
                )}
                <button
                  onClick={downloadFile}
                  className="flex items-center px-4 py-2 text-indigo-600 text-sm font-medium transition duration-200 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                >
                  <BiDownload className="mr-2" size={20} />
                  DOWNLOAD
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ReusableModal
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        title={action}
      >
        {action === "status" && <JsonView value={jsonValue} />}
        {action === "reset" && (
          <div>
            <h1>Reset branch?</h1>
            <button
              onClick={requestReset}
              className="bg-red-600 text-white px-4 py-2 rounded-md mt-14"
            >
              Yes
            </button>
          </div>
        )}
        {action === "OPEN PR" && <PrForm setIsOpen={setModalOpen} />}
      </ReusableModal>
    </>
  );
}

export function BranchListBox({
  selected,
  onChange,
  branches,
}: {
  selected: { id: number; name: string };
  onChange: React.Dispatch<React.SetStateAction<{ id: number; name: string }>>;
  branches: { id: number; name: string }[];
}) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative z-50">
        <Listbox.Button className="relative w-full min-w-80 cursor-default bg-white px-4 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm font-medium border-2 transition duration-200">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <RiArrowUpDownFill
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {branches.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
                value={person}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {person.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <BiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

const PrForm = ({ setIsOpen }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dataContext = React.useContext(DataContext);

  const onSubmit = async (data: any) => {
    try {
      dataContext.setLoading(true);
      console.log(localStorage.getItem("orignalRepoLink"));
      const body = {
        ...data,
        url: localStorage.getItem("orignalRepoLink") as string,
      };
      const prLink = await axios.post(`${baseUrl}/git/openPR`, body);
      dataContext.setLoading(false);
      setIsOpen(false);
      window.open(prLink.data, "_blank");
    } catch {
      dataContext.setLoading(false);
      toast.error("Error opening PR");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-2">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mt-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Title is required</span>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mt-1"
          >
            Message
          </label>
          <input
            id="message"
            type="text"
            {...register("message", { required: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.message && (
            <span className="text-red-500 text-sm">Message is required</span>
          )}
        </div>

        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 mt-1"
          >
            Token
          </label>
          <input
            id="token"
            type="text"
            {...register("token", { required: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.token && (
            <span className="text-red-500 text-sm">Token is required</span>
          )}
        </div>

        <div className="mt-2 pb-2">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

function convertBranchToUrl(baseUrl: string, branchName: string): string {
  // Replace the base branch name "remotes/origin/" with an empty string
  const formattedBranchName = branchName.replace(/^remotes\/origin\//, "");

  // Construct the final URL
  const finalUrl = `${baseUrl}/tree/${formattedBranchName}`;

  return finalUrl;
}
