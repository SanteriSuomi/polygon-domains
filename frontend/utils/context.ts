import { createContext } from "react";
import { Context } from "../types/types";

const appContext = createContext<Context>(undefined);

export { appContext };