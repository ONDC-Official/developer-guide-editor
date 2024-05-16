import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { Editable } from "../file-structure";
import { deleteData } from "../../utils/requestUtils";
import { DataContext } from "../../context/dataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  isOpen: any;
  setIsOpen: any;
  editable: Editable;
  onConfirm: any;
}

export default function DeleteModal({
  isOpen,
  setIsOpen,
  editable,
  onConfirm: onConfirm,
}: ModalProps) {
  function closeModal() {
    setIsOpen(false);
  }

  async function handleSave() {
    let query = {};
    if (editable.query.deleteParams) {
      query = editable.query.deleteParams;
    }
    console.log("Deleting", editable.path, query);
    await deleteData(editable.deletePath, query);
    console.log("GETTING", editable.query.Parent?.query.getData);
    await editable.query.Parent?.query.getData();
    toast.success("Deleted successfully");
    closeModal();
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-screen-sm transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm
                  </Dialog.Title>
                  <div>{`Are you sure you want to delete ${editable.registerID}?`}</div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={handleSave}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
