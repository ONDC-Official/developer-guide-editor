import { EditMode } from "../utils/config";
import { Listbox, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { FaExclamationCircle, FaGithub, FaUndo } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";

export function GitActionsTab({}) {
  return (
    <div className="flex flex-row h-14 w-full bg-slate-200 fixed top-20 z-10 border-b-2 border-t-2 border-gray-500">
      <div className="flex items-center justify-between w-full px-4">
        <div className="relative inline-block text-left">
          <a
            href="https://github.com/ONDC-Official/ONDC-FIS-Specifications.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            ONDC-Official/ONDC-FIS-Specifications
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <BranchListBox />
          {EditMode && (
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-sm font-medium px-4 py-2 text-red-600 transition duration-200 border-2 border-red-600 hover:bg-red-600 hover:text-white">
                <FaUndo className="mr-2" />
                RESET
              </button>
              <button className="flex items-center px-4 py-2 text-yellow-600 text-sm font-medium transition duration-200 border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white">
                <FaExclamationCircle className="mr-2" />
                STATUS
              </button>
              <button className="flex items-center px-4 py-2 text-green-600 text-sm font-medium transition duration-200 border-2 border-green-600 hover:bg-green-600 hover:text-white">
                <FaGithub className="mr-2" />
                OPEN PR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const people = [
  { id: 1, name: "master" },
  { id: 2, name: "old-fis" },
  { id: 3, name: "FIS18" },
  { id: 4, name: "feat/marine-change-log" },
  { id: 5, name: "feat/FIS10" },
];

function BranchListBox({}) {
  const [selected, setSelected] = useState(people[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button className="relative w-full min-w-60 cursor-default bg-white px-4 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm font-medium border-2 transition duration-200">
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
            {people.map((person, personIdx) => (
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
                      className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
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
