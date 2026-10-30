import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { TabContext, type TabType } from "../contexts/TabContext";

interface TabProviderProps {
  defaultTab?: TabType;
  allCount: number;
  unreadCount: number;
  isLoading?: boolean;
  children: ReactNode;
}

export default function TabProvider({
  defaultTab = "all",
  allCount,
  unreadCount,
  isLoading = false,
  children,
}: TabProviderProps) {
  const [tab, setTab] = useState<TabType>(defaultTab);
  const [currentUnreadCount, setCurrentUnreadCount] = useState(unreadCount);

  useEffect(() => {
    setCurrentUnreadCount(unreadCount);
  }, [unreadCount]);

  const decrementUnreadCount = useCallback(() => {
    setCurrentUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const value = useMemo(
    () => ({
      tab,
      setTab,
      allCount,
      unreadCount: currentUnreadCount,
      isLoading,
      decrementUnreadCount,
    }),
    [
      tab,
      allCount,
      currentUnreadCount,
      isLoading,
      decrementUnreadCount,
    ],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}