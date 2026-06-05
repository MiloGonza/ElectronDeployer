import { useLocation } from "react-router-dom";
import AsideItem from "../components/nav/AsideItem";
import FolderIcon from "../assets/icons/FolderIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import ColoredPythonIcon from "../assets/icons/ColoredPythonIcon";
import { useProjectStore } from "../../electron/zustant";
import { motion } from "motion/react";

function AsideBar() {
    const location = useLocation();
    const pathname = location.pathname;
    const { entornoActivo, pythonVersion } = useProjectStore();

    return (
        <div className="w-90 h-screen bar-bg text-app flex flex-col gap-5">
            <div className="mt-10 flex flex-col gap-5 justify-between h-full">
                <div>
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
                <div className="flex flex-col h-fit m-5 gap-6 p-8 bg-[#000000] border border-bg-secondary rounded-xl">
                    <div className="flex gap-2 items-center h-fit">
                        <div className={`flex rounded-full transition-all duration-300 ${entornoActivo ? 'bg-green-500' : 'bg-red-500'} h-3 w-3`} />
                        <span className="text-sm text-muted">
                            {entornoActivo ? 'Entorno activo' : 'Entorno inactivo'}
                        </span>
                    </div>
                    {/* <div className="flex flex-col gap-2 items-center w-full text-center">
                        <span className="text-xl text-center w-full">
                            MyProject
                        </span>
                        <span className="bg-success text-success p-2 rounded-xl font-medium">
                            Activo
                        </span>
                    </div> */}
                    {
                        pythonVersion ? (
                            <motion.div key="python-version"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="grid grid-cols-3 items-center justify-center w-full">
                                <ColoredPythonIcon />
                                <div className="flex flex-col col-span-2 items-start text-nowrap">
                                    <span>
                                        Python in enviroment
                                    </span>
                                    <span className="text-sm text-muted">
                                        3.11.9
                                    </span>
                                </div>
                            </motion.div>
                        )
                            :
                            (
                                <motion.div key="no-python-version"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center justify-center w-full">
                                    <span className="text-sm text-muted">
                                        No se ha detectado python en el entorno
                                    </span>
                                </motion.div>
                            )
                    }
                </div>
            </div>
        </div>
    );
}

export default AsideBar;