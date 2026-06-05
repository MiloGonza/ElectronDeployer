import { create } from "zustand";

export const useProjectStore = create((set) => ({
    //Proyecto
    rutaProyecto: null,
    runserverActive: false,
    setRutaProyecto: (ruta) => set({ rutaProyecto: ruta }),
    setRunserverActive: (active) => set({ runserverActive: active }),
    // NombreProjecto: null,
    // setNombreProjecto: (nombre) => set({ NombreProjecto: nombre }),

    //Entorno
    rutaEnv: null,
    entornoActivo: false,
    pythonVersion: null,
    setRutaEnv: (ruta) => set({ rutaEnv: ruta }),
    setEntornoActivo: (activo) => set({ entornoActivo: activo }),
    setPythonVersion: (version) => set({ pythonVersion: version }),

    // Consola
    output: null,
    setOutput: (output) => set({ output }),
}));