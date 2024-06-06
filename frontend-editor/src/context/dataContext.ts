import { Editable } from "../components/file-structure";
import { Context, createContext } from "react";

interface DataContextProps {
  activePath: React.MutableRefObject<string>;
  setActivePath: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeEditable: Editable | undefined;
  setActiveEditable: React.Dispatch<React.SetStateAction<Editable | undefined>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
}

export const DataContext = createContext({} as DataContextProps);
