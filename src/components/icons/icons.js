import { BiSolidDashboard } from "react-icons/bi";
import { PiPackageFill } from "react-icons/pi";
import { AiFillProduct } from "react-icons/ai";
import { MdStars } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { RiUserStarFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { MdKeyboardArrowRight, MdError, MdDragIndicator  } from "react-icons/md";
import { LuEyeClosed, LuEye  } from "react-icons/lu";
import { IoMdNotifications } from "react-icons/io";
import { BsTypeItalic, BsTypeUnderline, BsTypeBold } from "react-icons/bs";
import { FaListUl,  FaListOl } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";

export const Icons = {
    dashboard: BiSolidDashboard,
    proposals: CgNotes,
    packages: PiPackageFill,
    products: AiFillProduct,
    services: MdStars,
    users: HiUsers,
    clients:  RiUserStarFill,
    rightArrow: MdKeyboardArrowRight,
    error: MdError,
    passwordEyeOpen: LuEye,
    passwordEyeClosed: LuEyeClosed,
    notification: IoMdNotifications,
    boldIcon: BsTypeBold,
    italicIcon: BsTypeItalic,
    underlineIcon: BsTypeUnderline,
    unorderedList: FaListUl,
    orderedList: FaListOl,
    delete: FaRegTrashCan,
    drag: MdDragIndicator,
    plusButton: FiPlusCircle

};

