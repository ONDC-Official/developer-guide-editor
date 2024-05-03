import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Editable } from "../file-structure";
import FormFactory from "../forms/form-factory";
import { IoCloseCircleOutline } from "react-icons/io5";
import JsonField from "../forms/JsonField";
import { DataContext } from "../../context/dataContext";

interface EditModalProps {
  isOpen: any;
  setIsOpen: any;
  item: Editable;
}

export default function RawModal({ isOpen, setIsOpen, item }: EditModalProps) {
  function closeModal() {
    setIsOpen(false);
  }
  const [defCode, setDefCode] = useState<any>("");
  const dataContext = useContext(DataContext);
  useEffect(() => {
    if (!isOpen) return;
    console.log("hello");
    dataContext.setLoading(true);
    if (item.query.copyData) {
      item.query.copyData().then((data) => {
        setDefCode(data);
        dataContext.setLoading(false);
      });
    } else {
      dataContext.setLoading(false);
    }
  }, [isOpen]);

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
                <Dialog.Panel className="w-full max-w-screen-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    <span>{`${item.registerID} - ${item.name}`}</span>
                    <IoCloseCircleOutline
                      size={30}
                      onClick={closeModal}
                      style={{ cursor: "pointer" }}
                    />
                  </Dialog.Title>
                  <div className="mt-2"></div>
                  {!dataContext.loading && (
                    <JsonField
                      readOnly={true}
                      DefaultCode={defCode}
                      onSubmit={async (code: string) => {
                        setIsOpen(false);
                      }}
                    />
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
