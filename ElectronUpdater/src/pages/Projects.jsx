// import { useOutletContext } from "react-router-dom";
// import MyButton from "../components/general/MyButton";

import { use, useEffect, useState } from "react";
import { GetProjects } from "../api/ProjectsApi";
import { AnimatePresence, motion } from "motion/react";
import PlusIcon from "../assets/icons/PlusIcon";
import MyButton from "../components/general/MyButton";

function Projects() {

    const [projectList, setProjectList] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [importedFolder, setImportedFolder] = useState({})
    
    // const context = useOutletContext();

    const handleImportClick = async () => {
        try {
            const folderPath = await window.electronAPI.selectFolder({ title: 'Seleccionar carpeta del proyecto' });
            const folderName = folderPath ? folderPath.split(/[\\/]/).pop() : ''
            if (folderPath) {
                setImportedFolder({
                    folderPath:folderPath,
                    folderName:folderName
                })
            }
        } catch (error) {
            alert(`No se ha podido seleccionar la carpeta del proyecto: ${error}`);
        }
    };

    useEffect(() => {
        console.log("imported folder", importedFolder)
    }, [importedFolder])

    useEffect(() => {
        GetProjects().then((response) => {
            setProjectList(response.results)
        }).catch(() => {
            alert("No se ha podido obtener la lista de proyectos")
        });

        return
    }, []);

    return (
        <article className="flex-col gap-6 flex h-full relative">
            <div className="flex  gap-5 justify-between">
                <div className="flex-col gap-3 flex">
                    <h1 className="text-3xl font-bold">Proyectos</h1>
                    <p>
                        En este apartado podra ver, seleccionar y guardar diferentes proyectos para cargarlos y administrarlos rapidamente
                    </p>
                </div>
                <div>
                    {/* <MyButton
                        bg="button-primary"
                        textColor="text-accent"
                        label="Abrir carpeta del proyecto"
                        onClick={handleSelectProjectFolder}
                        icon={<FolderIcon
                            fill="transparent"
                            stroke="#FA7F02"
                            size={1.5}
                        />}
                    /> */}
                </div>
            </div>
            <div className="flex gap-2 flex-col">
                <h2 className="text-xl">Proyectos guardados</h2>
                <div className="flex gap-2 flex-1 wrap-normal flex-wrap">
                    <AnimatePresence>
                        {projectList?.map((project) => (
                            <motion.div
                                key={project.ID}
                                onMouseEnter={() => setIsHovered(project.ID)}
                                onMouseLeave={() => setIsHovered(null)}
                                animate={{
                                    width: isHovered === project.ID ? 800 : 320
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut"
                                }}
                                className="
                                    bg-secondary
                                    p-4
                                    rounded-xl
                                    border
                                    border-bg-secondary
                                    h-60
                                    overflow-hidden
                                    flex
                                "
                            >
                                {/* Zona fija */}
                                <div
                                    className="
                                        basis-[288px]
                                        shrink-0
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        h-full
                                    "
                                >
                                    <img
                                        src="/"
                                        alt="Icono"
                                        className="
                                            w-full
                                            flex-1
                                            border-2
                                            rounded-xl
                                            object-cover
                                        "
                                    />

                                    <span>
                                        Nombre
                                    </span>
                                </div>

                                {/* Zona expandible */}
                                <motion.div
                                    animate={{
                                        opacity: isHovered === project.ID ? 1 : 0
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                    className="
                                        flex-1
                                        min-w-0
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                    "
                                >
                                    <p className="text-center w-full overflow-hidden ">
                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio autem laborum assumenda nesciunt ipsum, ratione labore dolores reiciendis consectetur beatae molestiae ex, minima eveniet praesentium asperiores tempora alias explicabo qui.
                                        Quae quibusdam ipsa, iure, earum minima quis quam quia explicabo minus accusamus reiciendis corporis? Itaque iusto consequatur expedita recusandae, natus at ducimus. Numquam neque animi corporis illum at mollitia esse.
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <MyButton
                        onClick={handleImportClick}
                        className="agregar bg-secondary relative p-4 rounded-xl border border-bg-secondary h-60 w-60 overflow-hidden flex flex-col hover:scale-105"
                    >
                        <span>
                            Agregar un nuevo proyecto
                        </span>
                        <div className="flex flex-1 items-center justify-center">
                            <PlusIcon stroke={"white"} size={5} />
                        </div>
                    </MyButton>

                </div>
            </div>
        </article>
    );
}

export default Projects;