import { useLocation } from "react-router-dom";
import AsideItem from "../components/AsideItem";

function AsideBar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="w-64 h-screen bg-[#181714] text-white flex flex-col gap-5">
            <div className="mt-10">
                <AsideItem
                    to="/"
                    path={pathname}
                    label="Inicio"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                fill={pathname === "/" ? "#FA7F02" : "currentColor"}
                                stroke={pathname === "/" ? "#FA7F02" : "currentColor"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1"
                            />
                        </svg>
                    }
                />

                <AsideItem
                    to="/proyectos"
                    path={pathname}
                    label="Proyectos"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                fill={pathname === "/proyectos" ? "#FA7F02" : "currentColor"}
                                stroke={pathname === "/proyectos" ? "#FA7F02" : "currentColor"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 13.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                            />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}

export default AsideBar;