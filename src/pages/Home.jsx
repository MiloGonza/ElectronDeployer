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
import { useProjectStore } from "../../electron/zustant";



function Home() {
    //const context = useOutletContext();

    const [output, setOutput] = useState('');
    const [platform, setPlatform] = useState('');
    const {
        rutaProyecto,
        setRutaProyecto,
        rutaEnv,
        setRutaEnv,
        setPythonVersion,
        setEntornoActivo,
        runserverActive,
        setRunserverActive,
    } = useProjectStore();

    useEffect(() => {
        window.electronAPI.getPlatform().then(setPlatform);

        if (
            !window.electronAPI ||
            !rutaProyecto
        ) return;

        window.electronAPI.startTerminal(
            rutaProyecto
        );


        // Cargar último proyecto persistido
        window.electronAPI.getLastProject().then((state) => {
            if (state?.rutaProyecto) {
                setRutaProyecto(state.rutaProyecto);
                setOutput(`> Proyecto cargado: ${state.rutaProyecto}\n`);
            }
        });

        return () => {

            if (
                window.electronAPI
                    ?.stopTerminal
            ) {

                window.electronAPI
                    .stopTerminal();
            }

        };
    }, [setRutaEnv, setRutaProyecto, rutaProyecto]);

    useEffect(() => {
        if (!window.electronAPI) return;

        const listener = (data) => {
            setOutput(prev => prev + data);
        };

        window.electronAPI.onCommandOutput(listener);

        return () => {
            window.electronAPI.removeCommandOutputListener();
        };
    }, []);

    const handleRunCommand = async (
        command,
        cwdTarget = 'project'
    ) => {
        let cwd = '';

        if (
            cwdTarget === 'env' &&
            rutaEnv
        ) {
            cwd = rutaEnv;
        } else if (rutaProyecto) {
            cwd = rutaProyecto;
        }

        try {
            const result = await window.electronAPI.runCommand({
                command,
                cwd
            });
            return Boolean(result?.ok);
        } catch (error) {
            setOutput(
                prev =>
                    prev +
                    `Error: ${error.message}\n`
            );
            return false;
        }
    };

    const handleSelectProjectFolder = async () => {
        if (!window.electronAPI) return;
        const folder = await window.electronAPI.selectFolder({ title: 'Seleccionar carpeta del proyecto' });
        if (folder) {
            setRutaProyecto(folder);
            setOutput((prev) => prev + `> Carpeta del proyecto: ${folder}\n`);
            await window.electronAPI.saveLastProject(folder);
        }
    };

    const handleSelectEnvFolder = async () => {
        if (!window.electronAPI) return;
        const folder = await window.electronAPI.selectFolder({ title: 'Seleccionar carpeta del entorno virtual' });
        if (folder) {
            setRutaEnv(folder);
            setOutput((prev) => prev + `> Carpeta del entorno: ${folder}\n`);
        }
    };

    const handleClearProject = async () => {
        setRutaProyecto('');
        setRutaEnv('');
        if (window.electronAPI?.clearLastProject) {
            await window.electronAPI.clearLastProject();
        }
        setOutput((prev) => prev + `> Selección de proyecto limpiada\n`);
    };

    const handlerGetPythonVersion = async () => {
        if (!window.electronAPI) return;
        try {
            const version = await window.electronAPI.getPythonVersion(rutaEnv);
            setPythonVersion(version);
            setOutput((prev) => prev + `> Versión de Python: ${version}\n`);
        } catch (error) {
            setOutput((prev) => prev + `Error al obtener versión de Python: ${error.message}\n`);
        }
    }


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
                        onClick={handleSelectProjectFolder}
                        icon={<FolderIcon
                            fill="transparent"
                            stroke="#FA7F02"
                            size={1.5}
                        />}
                    />
                </div>
            </div>
            <ProjectCard
                rutaEnv={rutaEnv}
                rutaProyecto={rutaProyecto}
                NombreProjecto={rutaProyecto ? rutaProyecto.split(/[\\/]/).pop() : ''}
                onSelectEnv={handleSelectEnvFolder}
                onClearProject={handleClearProject}
                handlerGetPythonVersion={handlerGetPythonVersion}
            />
            <div className="flex flex-col gap-2">
                <h2>
                    Acciones rapidas
                </h2>
                <div className="grid grid-cols-4 items-center min-h-40 relative gap-20">
                    <ProjectRapidActions
                        icon={<CodeIcon />}
                        label="Activar entorno"
                        script={platform === 'win32' ? ("bin\\activate.bat") : "source bin/activate"}
                        color1="#853202"
                        color2="#181613"
                        borde="#793207"
                        cwdTarget="env"
                        onClick={handleRunCommand}
                        onChange={() => setEntornoActivo(true)}
                    />
                    {/* handleRunCommand, setEntornoActivo(true) */}
                    <ProjectRapidActions
                        icon={<PythonIcon />}
                        label="Ejecutar python"
                        script={`${platform === 'win32' ? "bin\\python.exe" : "bin/python"}`}
                        color1="#B42E1F"
                        color2="#4E1F1E"
                        borde="#AD2C2A"
                        cwdTarget="env"
                        onClick={handleRunCommand}
                    />
                    <ProjectRapidActions
                        icon={<TerminalIcon />}
                        label="abrir terminal"
                        script={`${platform === 'win32' ? "start cmd.exe" : "konsole"}`}
                        color1="#642358"
                        color2="#281927"
                        borde="#632C5D"
                        cwdTarget="project"
                        onClick={handleRunCommand}
                    />
                    <ProjectRapidActions
                        icon={<PlayIcon />}
                        label="Ejecutar desarrollo"
                        script="python manage.py runserver"
                        color1="#944B02"
                        color2="#2D1E0E"
                        borde="#C97101"
                        cwdTarget="project"
                        onClick={handleRunCommand}
                        onChange={() => setRunserverActive(true)}
                    />
                </div>
            </div>
            <div className="flex bg-secondary p-4 rounded-xl flex-1 border border-bg-secondary flex-col gap-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3>
                        Salida de comandos
                    </h3>
                    {
                        runserverActive && (
                            "El pp"
                        )
                    }
                </div>
                <div className="bg-primary flex flex-1 max-h-full max-x-full rounded-lg p-4 overflow-y-auto overflow-x-hidden whitespace-pre-wrap font-mono text-sm text-gray-300">
                    {output || '> Esperando comandos...'}
                </div>
            </div>

        </article>
    );
}

export default Home;