import { IoAddCircleOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import DeleteModal from "./delete-modal";
import EditModal from "./edit-modal";
import { Editable } from "../file-structure";

export default function EditorToolTip({
  data,
  showAdd = true,
  showDelete = true,
  showEdit = true,
  setButtonStates,
}: {
  data: Editable | null;
  showEdit?: boolean;
  showAdd?: boolean;
  showDelete?: boolean;
  setButtonStates: () => void;
}) {
  const [delModalState, setDelModalState] = useState(false);
  const [editModalState, setEditModalState] = useState(false);
  const editState = useRef(false);
  if (!data) {
    return (
      <div className="p-2 max-w-xs rounded-lg shadow-lg bg-white/30 backdrop-blur-lg text-white text-sm font-semibold text-center border border-white/20">
        404! Not Found
      </div>
    );
  }
  return (
    <>
      <div className="p-2 max-w-xs rounded-lg shadow-lg bg-white/30 backdrop-blur-lg text-white text-sm font-semibold text-center border border-white/20">
        <h1 className=" text-blue-500">{data.name}</h1>
        <div className="flex space-x-2 justify-center items-cent">
          {showEdit && (
            <button
              onClick={() => {
                editState.current = true;
                setEditModalState(true);
                setButtonStates();
              }}
              className=" bg-blue-400 hover:bg-blue-700 text-white font-bold py-1 px-2 focus:outline-none focus:shadow-outline"
              type="button"
            >
              <MdModeEditOutline className=" size-6" />
            </button>
          )}
          {showAdd && (
            <button
              onClick={() => {
                editState.current = false;
                setEditModalState(true);
                setButtonStates();
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 focus:outline-none focus:shadow-outline"
              type="button"
            >
              <IoAddCircleOutline className=" size-6" />
            </button>
          )}
          {showDelete && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                setDelModalState(true);
                setButtonStates();
              }}
            >
              <RiDeleteBin6Fill className=" size-6" />
            </button>
          )}
          <DeleteModal
            isOpen={delModalState}
            setIsOpen={setDelModalState}
            editable={data}
            onConfirm={() => {}}
          />
          <EditModal
            isOpen={editModalState}
            setIsOpen={setEditModalState}
            item={data}
            editState={editState.current}
          />
        </div>
      </div>
    </>
  );
}
