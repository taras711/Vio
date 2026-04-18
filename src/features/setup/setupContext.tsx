import { createContext, useContext } from "react";

export const SetupContext = createContext<boolean | null>(null);

export const useSetup = () => useContext(SetupContext);
