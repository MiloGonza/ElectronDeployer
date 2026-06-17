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
import Terminal from "../components/home/Terminal";
import { useEffect } from "react";
import { useProjectStore } from "../../electron/zustant";



function Home() {
    //const context = useOutletContext();

    const [platform, setPlatform] = useState('');
    const {
        rutaProyecto,
        setRutaProyecto,
        rutaEnv,
        setRutaEnv,
        setPythonVersion,
        entornoActivo,
        setEntornoActivo,
        runserverActive,
        setRunserverActive,
        output,
        setOutput,
        appendOutput,
        terminalActive,
        setTerminalActive,
        terminalInput,
        setTerminalInput,
    } = useProjectStore();

    useEffect(() => {
        if (!window.electronAPI) return;

        const listener = (data) => {
            appendOutput(data);
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

    // Activa el modo input de la terminal embebida. Garantiza que el
    // shell persistente esté vivo (lo crea en cwd=rutaProyecto si todavía
    // no existe; si ya existe, start-terminal es un no-op idempotente).
    const handleOpenTerminal = async () => {
        if (!window.electronAPI) return;

        if (!rutaProyecto) {
            setOutput((prev) => prev + `> Necesitás seleccionar una carpeta de proyecto primero\n`);
            return;
        }

        try {
            await window.electronAPI.startTerminal(rutaProyecto);
            setTerminalActive(true);
            setOutput((prev) => prev + `> Terminal interactiva activa (cwd: ${rutaProyecto})\n`);
        } catch (error) {
            setOutput((prev) => prev + `Error al abrir terminal: ${error.message}\n`);
        }
    };

    // Enter en el input: manda el comando al stdin del shell persistente
    // y deja una línea '$ <cmd>' en el output como rastro.
    const handleTerminalSubmit = async (text) => {
        if (!window.electronAPI) return;
        setOutput((prev) => prev + `$ ${text}\n`);
        try {
            await window.electronAPI.sendTerminalInput(text);
        } catch (error) {
            setOutput((prev) => prev + `Error al enviar comando: ${error.message}\n`);
        }
    };

    // Ctrl+C en el input: manda ^C al shell (corta lo que esté en
    // foreground, p.ej. runserver). Anota la interrupción en el log.
    const handleTerminalInterrupt = async () => {
        if (!window.electronAPI) return;
        setOutput((prev) => prev + `^C\n`);
        try {
            await window.electronAPI.sendTerminalSignal('\x03');
        } catch (error) {
            setOutput((prev) => prev + `Error al enviar ^C: ${error.message}\n`);
        }
    };

    // Apaga el flag 'entorno activo' y manda 'deactivate' al shell
    // (si fue activado por el botón de 'Activar entorno'). En cmd.exe el
    // activate.bat no siempre expone un deactivate.bat; si no existe el
    // script, el sendTerminalInput falla silenciosamente (el flag igual
    // se apaga, que es lo que el usuario ve).
    const handleDeactivateEnv = async () => {
        setEntornoActivo(false);
        setOutput((prev) => prev + `> Desactivando entorno…\n`);
        try {
            await window.electronAPI.sendTerminalInput('deactivate');
        } catch (error) {
            setOutput((prev) => prev + `deactivate no disponible: ${error.message}\n`);
        }
    };

    // Detener runserver: manda ^C al shell (mismo flujo que el botón
    // Ctrl+C) y apaga el flag visual. La señal interrumpe el proceso
    // que esté en foreground, que es justamente el runserver.
    const handleStopRunserver = async () => {
        setRunserverActive(false);
        await handleTerminalInterrupt();
    };


    return (
        <article className="flex-col gap-6 flex h-full relative">
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
                <h2 className="text-xl">
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
                        onChange={() => {
                            setEntornoActivo(true);
                            setTerminalActive(false);
                        }}
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
                        onChange={() => setTerminalActive(false)}
                    />
                    <ProjectRapidActions
                        icon={<TerminalIcon />}
                        label="Escribir en terminal"
                        color1="#642358"
                        color2="#281927"
                        borde="#632C5D"
                        onClickCustom={handleOpenTerminal}
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
                        onChange={() => {
                            setRunserverActive(true);
                            setTerminalActive(false);
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1 min-h-0">
                <h3 className="text-xl">Salida de comandos</h3>
                <Terminal
                    output={output}
                    title={`bash — ${rutaProyecto ? rutaProyecto.split(/[\\/]/).pop() : 'sin proyecto'}`}
                    onClear={() => setOutput('')}
                    status={runserverActive ? 'running' : 'idle'}
                    active={terminalActive}
                    inputValue={terminalInput}
                    onInputChange={setTerminalInput}
                    onSubmit={handleTerminalSubmit}
                    onInterrupt={handleTerminalInterrupt}
                    actions={
                        <>
                            {entornoActivo && (
                                <MyButton
                                    bg="button-primary"
                                    textColor="text-accent"
                                    className="text-xs"
                                    padding="px-2 py-1"
                                    label="Desactivar entorno"
                                    onClick={handleDeactivateEnv}
                                />
                            )}
                            {runserverActive && (
                                <MyButton
                                    bg="button-primary"
                                    textColor="text-accent"
                                    className="text-xs"
                                    padding="px-2 py-1"
                                    label="Detener runserver"
                                    onClick={handleStopRunserver}
                                />
                            )}
                            {terminalActive && (
                                <MyButton
                                    bg="button-primary"
                                    textColor="text-accent"
                                    className="text-xs"
                                    padding="px-2 py-1"
                                    label="Ctrl + C"
                                    onClick={handleTerminalInterrupt}
                                />
                            )}
                        </>
                    }
                />
            </div>

        </article>
    );
}

export default Home;