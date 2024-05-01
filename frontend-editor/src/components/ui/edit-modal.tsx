import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import { Editable } from "../file-structure";
import Dropdown from "../horizontal-tab";
import FormFactory from "../forms/form-factory";
import { IoCloseCircleOutline } from "react-icons/io5";

interface EditModalProps {
  isOpen: any;
  setIsOpen: any;
  item: Editable;
  editState: boolean;
}

export default function EditModal({
  isOpen,
  setIsOpen,
  item,
  editState,
}: EditModalProps) {
  function closeModal() {
    setIsOpen(false);
  }

  // const form = FormFactory(item);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className=" relative z-20"
          onClose={() => {}}
          onFocus={() => {
            console.log("FOCUS ON MODAL");
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/25 "
              onMouseOver={(e) => {
                e.stopPropagation();
              }}
            />
          </Transition.Child>

          <div
            className="fixed inset-0 overflow-y-auto "
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-left">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-screen-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    <span>
                      {editState ? `Edit ${item.name}` : `Add In ${item.name}`}
                    </span>
                    <IoCloseCircleOutline
                      size={30}
                      onClick={closeModal}
                      style={{ cursor: "pointer" }}
                    />
                  </Dialog.Title>
                  <div className="mt-2"></div>

                  <FormFactory
                    data={item}
                    setIsOpen={setIsOpen}
                    editState={editState}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
