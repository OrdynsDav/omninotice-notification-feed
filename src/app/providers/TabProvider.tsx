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
  const clearUnreadCount = useCallback(() => {
    setCurrentUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      tab,
      setTab,
      allCount,
      unreadCount: currentUnreadCount,
      isLoading,
      decrementUnreadCount,
      clearUnreadCount,
    }),
    [
      tab,
      allCount,
      currentUnreadCount,
      isLoading,
      decrementUnreadCount,
      clearUnreadCount,
    ],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}