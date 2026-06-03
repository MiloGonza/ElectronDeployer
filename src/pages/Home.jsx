//import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import CodeIcon from "../assets/icons/CodeIcon";
import FolderIcon from "../assets/icons/FolderIcon";
import PlayIcon from "../assets/icons/PlayIcon";
import PythonIcon from "../assets/icons/PythonIcon";
import TerminalIcon from "../assets/icons/TerminalIcon";
import MyButton from "../components/general/MyButton";
import ProjectCard from "../components/home/ProjectCard";
import ProjectRapidActions from "../components/home/ProjectRapidActions";
import { useEffect } from "react";


function Home() {
    //const context = useOutletContext();

    const [output, setOutput] = useState('');

    useEffect(() => {
        if (!window.electronAPI) return;

        window.electronAPI.onCommandOutput(data => {
            setOutput(prev => prev + data);
        });

        return () => {
            if (window.electronAPI?.removeCommandOutputListener) {
                window.electronAPI.removeCommandOutputListener();
            }
        };
    }, []);

    const handleRunCommand = async (command) => {
        setOutput(`> ${command}\n`);
        try {
            await window.electronAPI.runCommand(command);
        } catch (error) {
            setOutput((prev) => prev + `Error: ${error.message}\n`);
        }
    };


    return (
        <article className="flex-col gap-10 flex h-full relative">
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
            <div className="flex flex-col gap-2">
                <h2>
                    Acciones rapidas
                </h2>
                <div className="grid grid-cols-4 items-center h-40 relative gap-20">
                    <ProjectRapidActions
                        icon={<CodeIcon />}
                        label="Activar entorno"
                        script="env\Scripts\activate"
                        color1="#853202"
                        color2="#181613"
                        borde="#793207"
                        onClick={handleRunCommand}
                    />
                    <ProjectRapidActions
                        icon={<PythonIcon />}
                        label="Ejecutar python"
                        script="env\scripts\python.exe"
                        color1="#B42E1F"
                        color2="#4E1F1E"
                        borde="#AD2C2A"
                        onClick={handleRunCommand}
                    />
                    <ProjectRapidActions
                        icon={<TerminalIcon />}
                        label="abrir terminal"
                        script="cmd.exe"
                        color1="#642358"
                        color2="#281927"
                        borde="#632C5D"
                        onClick={handleRunCommand}
                    />
                    <ProjectRapidActions
                        icon={<PlayIcon />}
                        label="Ejecutar desarrollo"
                        script="python manage.py runserver"
                        color1="#944B02"
                        color2="#2D1E0E"
                        borde="#C97101"
                        onClick={handleRunCommand}
                    />
                </div>
            </div>
            <div className="flex bg-secondary p-4 rounded-xl flex-1 border border-bg-secondary flex-col gap-4">
                <h3>
                    Salida de comandos
                </h3>
                <div className="bg-primary flex-1 rounded-lg p-4 overflow-auto whitespace-pre-wrap font-mono text-sm text-gray-300">
                    {output || '> Esperando comandos...'}
                </div>
            </div>

        </article>
    );
}

export default Home;