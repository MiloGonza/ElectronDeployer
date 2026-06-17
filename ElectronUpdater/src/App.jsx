import AsideBar from "./bars/AsideBar";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import AnimatedOutlet from "./components/layout/AnimatedOutlet";
import { useProjectStore } from "../electron/zustant";

export default function App() {

    const location = useLocation();
    const previousPath = useRef(location.pathname);

    useEffect(() => {
        previousPath.current = location.pathname;
    }, [location.pathname, previousPath]);

    // Inicializar la terminal persistente UNA vez, a nivel de app.
    // No hay cleanup: el shell vive hasta que se cierre la app entera.
    // Si el usuario aún no tiene rutaProyecto persistida, no se inicia
    // (esperamos a que la cargue desde Home).
    useEffect(() => {
        const initTerminal = async () => {
            if (!window.electronAPI?.startTerminal) return;
            const { rutaProyecto } = useProjectStore.getState();
            if (rutaProyecto) {
                await window.electronAPI.startTerminal(rutaProyecto);
            }
        };
        initTerminal();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-primary">
            <AsideBar />

            <main className="flex-1 p-4">
                <AnimatedOutlet location={location} previousPath={previousPath} />
            </main>
        </div>
    );
}
