import { Button } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import { useTab } from "@/hooks/useTab";
import "./Tab.css";

export default function Tab() {
  const { tab, setTab } = useTab();

  return (
    <div className={omni("tabs")}>
      <Button
        className="tab"
        variant={tab === "all" ? "primary" : "secondary"}
        aria-pressed={tab === "all"}
        onClick={() => setTab("all")}
      >
        Все
      </Button>
      <Button
        className="tab"
        variant={tab === "unread" ? "primary" : "secondary"}
        aria-pressed={tab === "unread"}
        onClick={() => setTab("unread")}
      >
        Непрочитанные
      </Button>
    </div>
  );
}
