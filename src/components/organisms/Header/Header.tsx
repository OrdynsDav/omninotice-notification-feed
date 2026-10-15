import { Breadcrumbs, InfoButton, Search } from "@/components/molecules";
import "./Header.css";
import { omni } from "@/helpers/omni";

export default function Header() {
  return (
    <header className={omni("header")}>
      <Breadcrumbs />
      {/* <div className={omni("header__actions")}>
        <Search />
        <InfoButton />
      </div> */}
    </header>
  );
}
