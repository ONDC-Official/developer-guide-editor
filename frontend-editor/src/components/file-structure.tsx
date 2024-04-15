import React from "react";
import { DownArrowIcon, RightArrowIcon } from "./icons";

interface BaseItem {
  name: string;
  path: string;
}

export interface FileItem extends BaseItem {
  type: "file";
}

export interface DirectoryItem extends BaseItem {
  type: "directory";
  children: FileSystemItem[];
}

export type FileSystemItem = FileItem | DirectoryItem;

// FileIcon and FolderIcon can be any icons from a library or custom SVGs
const FileIcon: React.FC = ({ className: cn }: any) => (
  <span className={cn}>📄</span>
);
const FolderIcon: React.FC = ({ className: cn }: any) => (
  <span className={cn}>📁</span>
);

// Recursive component to display each item (file or folder)
const FileTreeItem: React.FC<{ item: FileSystemItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);
  console.log(item.name, item.type);
  if (item.type === "directory") {
    return (
      <div>
        <div
          className="flex items-center space-x-2 px-5 py-2 cursor-pointer hover:bg-gray-100"
          onClick={toggle}
        >
          {isOpen ? (
            <DownArrowIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <RightArrowIcon className="w-5 h-5 text-gray-500" />
          )}
          <FolderIcon />
          <span className="flex-grow text-gray-700">{item.name}</span>
        </div>
        {isOpen && (
          <div className="pl-5">
            {item.children.map((child) => (
              <FileTreeItem key={child.path} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-2 px-5 py-2 hover:bg-gray-100">
        <FileIcon />
        <span className="flex-grow text-gray-700">{item.name}</span>
      </div>
    );
  }
};

// Main component to display the sidebar with the file structure
export const FileStructureSidebar: React.FC<{
  data: FileSystemItem[];
}> = ({ data }) => {
  return (
    <div className="flex h-screen">
      <div className="mt-3 w-64 h-full overflow-y-auto shadow-lg">
        <h1
          className="font-bold text-center text-transparent bg-clip-text flex-grow"
          style={{
            fontSize: "1.3rem",
            backgroundImage: "linear-gradient(to right, #007CF0, #00DFD8)",
          }}
        >
          FILE STRUCTURE
        </h1>
        <ul className="mt-2">
          {data.map((item) => (
            <li key={item.path} className="px-2 py-2">
              <FileTreeItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
