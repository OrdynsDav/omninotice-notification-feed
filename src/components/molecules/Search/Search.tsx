import { Input, SearchIcon } from "@/components/atoms";
import "./Search.css"

export default function Search() {
  return (
    <form className="search" action="#">
        <Input leftIcon={SearchIcon} type="search" placeholder="Поиск" name="search"/>
    </form>
  )
}
