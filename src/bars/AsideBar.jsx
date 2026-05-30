import { useLocation } from "react-router-dom";
import AsideItem from "../components/nav/AsideItem";
import FolderIcon from "../assets/icons/FolderIcon";
import HomeIcon from "../assets/icons/HomeIcon";

function AsideBar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="w-64 h-screen bar-bg text-app flex flex-col gap-5">
            <div className="mt-10">
                <AsideItem
                    to="/"
                    path={pathname}
                    label="Inicio"
                    icon={
                        <HomeIcon
                            size={2}
                            fill={pathname === "/" ? "#FA7F02" : "currentColor"}
                            stroke={pathname === "/" ? "#FA7F02" : "currentColor"}
                        />
                    }
                />

                <AsideItem
                    to="/proyectos"
                    path={pathname}
                    label="Proyectos"
                    icon={
                        <FolderIcon
                            size={2}
                            fill={pathname === "/proyectos" ? "#FA7F02" : "currentColor"}
                            stroke={pathname === "/proyectos" ? "#FA7F02" : "currentColor"}
                        />
                    }
                />
            </div>
        </div>
    );
}

export default AsideBar;