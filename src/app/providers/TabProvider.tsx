import { useMemo, useState, type ReactNode } from "react";
import { TabContext, type TabType } from "../contexts/TabContext";

interface TabProviderProps {
  defaultTab?: TabType;
  children: ReactNode;
}

export default function TabProvider({
  defaultTab = "all",
  children,
}: TabProviderProps) {
  const [tab, setTab] = useState<TabType>(defaultTab);

  // useMemo, чтобы потребители не перерисовывались, пока tab не поменялся
  const value = useMemo(() => ({ tab, setTab }), [tab]);

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}