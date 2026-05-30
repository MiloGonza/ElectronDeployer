//import { useOutletContext } from "react-router-dom";
import FolderIcon from "../assets/icons/FolderIcon";
import MyButton from "../components/general/MyButton";
import ProjectCard from "../components/home/ProjectCard";


function Home() {
    //const context = useOutletContext();
    return (
        <article className="flex-col gap-10 flex">
            <div className="flex  gap-5 justify-between">
                <div className="flex-col gap-3 flex">
                    <h1 className="text-3xl font-bold">Bienvenido!</h1>
                    <p>
                        Esta aplicacion es para controlar los entornos de desarrollo, realizar comandos, y gestionar los proyectos de manera sencilla y rapida
                    </p>
                </div>
                <div>
                    <MyButton
                        bg="button-primary"
                        textColor="text-accent"
                        label="Abrir carpeta del proyecto"
                        icon={<FolderIcon
                            fill="transparent"
                            stroke="#FA7F02"
                            size={1.5}
                        />}
                    />
                </div>
            </div>
            <ProjectCard />

        </article>
    );
}

export default Home;