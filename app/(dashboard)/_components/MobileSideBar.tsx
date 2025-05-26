import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SideBar from "./SideBar";

const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transtion">
        <Menu />
      </SheetTrigger>
      <SheetContent className="bg-white p-0" side="left">
        <SideBar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideBar;
