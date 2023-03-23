import { createContext, useContext } from "react";
import { config } from "~/helpers";
import type { User } from "~/types";

export const UserContext = createContext<User>({
  accountName: "",
  accountUrl: "",
  email: "",
  emailHash: "",
  meetingCount: 0,
  name: "",
  theme: config.themes[config.defaultTheme as keyof typeof config.themes],
  themeName: config.defaultTheme,
});

export const useUser = () => useContext(UserContext);
