import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

// const options = [
//   { id: 1, name: "Wade Cooper" },
//   { id: 2, name: "Arlene Mccoy" },
//   { id: 3, name: "Devon Webb" },
//   { id: 4, name: "Tom Cook" },
//   { id: 5, name: "Tanya Fox" },
//   { id: 6, name: "Hellen Schmidt" },
// ];

export interface AutoCompleteOption {
  id: number;
  value: string;
}

export default function AutoCompleteInput({
  register,
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: AutoCompleteOption;
  options: AutoCompleteOption[];
  register: any;
}) {
  const [selected, setSelected] = useState(options[0]);
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? options
      : options.filter((options) =>
          options.value
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  if (!options.length) return <div>Loading...</div>;
  return (
    <div className="w-full mb-4">
      <label className="block">{label}</label>
      <Combobox
        value={defaultValue ? defaultValue : selected}
        onChange={setSelected}
        disabled={defaultValue ? true : false}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              {...register(name)}
              className="w-full  border border-gray-300  py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
              displayValue={(op: AutoCompleteOption) => op.value}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2"></Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
              {filtered.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filtered.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? " bg-blue-500 text-white" : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.value}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          ></span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
