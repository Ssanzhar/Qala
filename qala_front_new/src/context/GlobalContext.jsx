import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [city, setCity] = useState("");

  return (
    <GlobalContext.Provider value={{ city, setCity }}>
      {children}
    </GlobalContext.Provider>
  );
};
