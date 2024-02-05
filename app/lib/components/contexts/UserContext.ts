import { createContext } from "react";
import { User } from "~/lib/types/user";


export const UserContext = createContext<User | undefined>(undefined);