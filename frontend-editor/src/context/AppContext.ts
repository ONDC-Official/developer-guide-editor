import { createContext } from "react";

interface AppContextProps {
  editMode: boolean;
  //   setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext({} as AppContextProps);
