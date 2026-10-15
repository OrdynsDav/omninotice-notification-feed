import { Button, SpinnerLoader, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import { useTab } from "@/hooks/useTab";
import "./Tab.css";

export default function Tab() {
  const { tab, setTab, unreadCount, allCount, isLoading } = useTab();

  return (
    <div className={omni("tabs")}>
      <Button
        className="tab"
        variant={tab === "all" ? "primary" : "secondary"}
        aria-pressed={tab === "all"}
        onClick={() => setTab("all")}
      >
        <Text variant={tab === "all" ? "paper" : "secondary"} weight="medium">
          Все
        </Text>

        {isLoading ? (
          <SpinnerLoader variant={tab === "all" ? "paper" : "secondary"} />
        ) : (
          <Text variant={tab === "all" ? "paper" : "secondary"} weight="medium">
            {allCount}
          </Text>
        )}
      </Button>
      <Button
        className="tab"
        variant={tab === "unread" ? "primary" : "secondary"}
        aria-pressed={tab === "unread"}
        onClick={() => setTab("unread")}
      >
        <Text
          variant={tab === "unread" ? "paper" : "secondary"}
          weight="medium"
        >
          Непрочитанные
        </Text>
        {isLoading ? (
          <SpinnerLoader variant={tab === "unread" ? "paper" : "secondary"} />
        ) : (
          <Text
            variant={tab === "unread" ? "paper" : "secondary"}
            weight="medium"
          >
            {unreadCount}
          </Text>
        )}
      </Button>
    </div>
  );
}
