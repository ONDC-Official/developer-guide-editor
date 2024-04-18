import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

export default function EditModal({ isOpen, setIsOpen, item }: any) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [postError, setPostError] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  async function handleSave() {
    closeModal();
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {item ? "Edit Domain" : "Add Domain"}
                  </Dialog.Title>
                  <div className="mt-2"></div>
                  {/* <div className="mt-1">
                    {isInvalid ? "INVALID INPUT DATA" : "DATA VALID"}
                  </div> */}
                  <div className="mt-4">
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        isInvalid
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "border border-transparent bg-blue-100 text-blue-900 hover:bg-blue-200"
                      }`}
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                  {postError ? (
                    <label className="block mt-2 text-sm font-medium text-red-700">
                      Error occurred while posting domain!
                    </label>
                  ) : (
                    ""
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
