import { Button, InfoIcon } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import "./InfoButton.css"

export default function InfoButton() {
  return (
    <Button className="info-btn" variant="icon" aria-label="Информация">
      <InfoIcon />
    </Button>
  );
}
