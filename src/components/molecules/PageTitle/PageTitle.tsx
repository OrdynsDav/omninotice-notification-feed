import { Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";

export default function PageTitle() {
  return (
    <div className={omni("page-title")}>
      <Text as="h1" size="xl" weight="semibold">
        Уведомления
      </Text>
      <Text variant="secondary">
        Объявления компании и&nbsp;сообщения о&nbsp;ваших задачах, отпусках
        и&nbsp;опросах
      </Text>
    </div>
  );
}
