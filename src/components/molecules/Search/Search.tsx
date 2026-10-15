import { Input, SearchIcon } from "@/components/atoms";
import "./Search.css"
import { omni } from "@/helpers/omni";

export default function Search() {
  return (
    <form className={omni("search")} action="#">
        <Input leftIcon={SearchIcon} type="search" placeholder="Поиск" name="search"/>
    </form>
  )
}
