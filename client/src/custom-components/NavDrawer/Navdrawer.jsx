import { RiMenu3Fill } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";

const Navdrawer = () => {
  return (
    <div>
      {" "}
      <Drawer>
        <DrawerTrigger asChild>
          <button className="text-xl active:scale-95">
            <RiMenu3Fill />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex justify-between items-center">
              <div>
                <DrawerTitle>Drawer Title</DrawerTitle>
                <DrawerDescription>Optional description</DrawerDescription>
              </div>
              <div>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="text-2xl mt-2 active:scale-95"
                  >
                    <IoCloseOutline />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>
          <div className="p-4">
            {/* Desktop Navigation */}
            <div className="block">
              <Link
                href="/add-jobs"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <p className=" border border-gray-300 px-2 py-2 hover:border-gray-600 rounded-md">
                  Post a Job
                </p>
              </Link>
              <Link
                href="/about-us"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <p>About</p>
              </Link>
            </div>
          </div>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Navdrawer;
