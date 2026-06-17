import { useEffect } from "react";
import CheckIcon from "../../assets/icons/CheckIcon";
import FolderIcon from "../../assets/icons/FolderIcon";
import MyButton from "../general/MyButton";
import { AnimatePresence, motion } from "motion/react";

function ProjectCard({ rutaEnv, rutaProyecto, NombreProjecto, onSelectEnv, onClearProject, handlerGetPythonVersion }) {

    const hasProject = Boolean(rutaProyecto);
    const hasEnv = Boolean(rutaEnv);

    useEffect(() => {
        if (hasEnv) {
            handlerGetPythonVersion();
        }
    }, [hasEnv]);

    return (
        <div className="bg-secondary p-4 rounded-xl border border-bg-secondary relative">
            <div className="flex gap-8">
                <div className="bg-linear-to-br from-[#F83601] to-[#ED8301] flex items-center p-2 rounded-2xl min-w-30 justify-center">
                    <FolderIcon fill="transparent" stroke="white" size={3} />
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-1 h-full justify-between">
                        <span className="text-sm text-muted">
                            {hasProject ? "Proyecto seleccionado" : "Proyecto reciente"}
                        </span>
                        <span>
                            {NombreProjecto || "Sin proyecto seleccionado"}
                        </span>
                        <span className="text-sm text-muted">
                            {rutaProyecto || "Selecciona una carpeta para empezar"}
                        </span>
                    </div>
                    <div className="gap-2 flex flex-col items-end">
                        <AnimatePresence mode="wait">
                            {hasProject ? (
                                <motion.button
                                    key="clear"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={onClearProject}
                                    className="text-xs px-2 py-1 rounded-md bg-danger text-danger hover:opacity-80 hover:cursor-pointer"
                                >
                                    Limpiar selección
                                </motion.button>
                            ) : null}
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            {hasEnv ? (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    key="detected"
                                    className="p-2 bg-success flex items-center gap-2 rounded-xl">
                                    <CheckIcon fill="#1B2919" stroke="#5DD346" size={1.5} />
                                    <span className="text-sm text-success">
                                        entorno detectado
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    key="not-detected"
                                    className="p-2 bg-danger flex items-center gap-2 rounded-xl">
                                    <CheckIcon fill="#1B2919" stroke="#ef4444" size={1.5} />
                                    <span className="text-sm text-danger">
                                        entorno no detectado
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex flex-col gap-1 items-end">
                            <span>
                                Ubicación del env:
                            </span>
                            <div className="flex gap-2 items-center">
                                <span className="text-sm text-muted max-w-xs truncate" title={rutaEnv}>
                                    {rutaEnv || "No se seleccionó un entorno"}
                                </span>
                                <MyButton
                                    onClick={() => onSelectEnv()}
                                    className="sticky right-4 bottom-0"
                                    bg="button-transparent"
                                    icon={<FolderIcon fill="transparent" stroke="#FA7F02" size={1.5} />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;
