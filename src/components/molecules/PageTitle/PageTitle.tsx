import { Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import "./PageTitle.css";
import { settings } from "@/config/settings.config";
import { decode } from "@/helpers/decoder";

export default function PageTitle() {
  return (
    <div className={omni("page-title")}>
      <Text as="h1" size="xxl" weight="semibold">
        {settings.pageTitle ?? "Уведомления"}
      </Text>
      <Text variant="secondary">
        {decode(settings.pageSubtitle) ??
          "Объявления компании и&nbsp;сообщения о&nbsp;ваших задачах, отпусках и&nbsp;опросах"}
      </Text>
    </div>
  );
}
