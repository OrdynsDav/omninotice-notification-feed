import { ArrowIcon, HomeIcon } from "@/components/atoms";
import "./Breadcrumbs.css";

export default function Breadcrumbs() {
  return (
    <nav className="omni-breadcrumbs">
      <ul className="omni-breadcrumbs__list">
        <li className="omni-breadcrumbs__item">
          <a className="omni-breadcrumbs__link" href="/">
            <HomeIcon />
          </a>
        </li>
        <li className="omni-breadcrumbs__item">
          <div className="omni-breadcrumbs__separator">
            <ArrowIcon />
          </div>
        </li>
        <li className="omni-breadcrumbs__item">
          <p className="omni-breadcrumbs__heading">Уведомления</p>
        </li>
      </ul>
    </nav>
  );
}
