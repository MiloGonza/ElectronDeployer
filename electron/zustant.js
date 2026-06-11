import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useProjectStore = create(
    persist(
        (set) => ({
            // Proyecto
            rutaProyecto: null,
            runserverActive: false,
            setRutaProyecto: (ruta) => set({ rutaProyecto: ruta }),
            setRunserverActive: (active) => set({ runserverActive: active }),

            // Entorno
            rutaEnv: null,
            entornoActivo: false,
            pythonVersion: null,
            setRutaEnv: (ruta) => set({ rutaEnv: ruta }),
            setEntornoActivo: (activo) => set({ entornoActivo: activo }),
            setPythonVersion: (version) => set({ pythonVersion: version }),

            // Consola (en memoria: se mantiene entre pestañas, no en disco)
            output: '',
            setOutput: (output) =>
                set((state) => ({
                    output:
                        typeof output === 'function'
                            ? output(state.output ?? '')
                            : output,
                })),
            appendOutput: (chunk) =>
                set((state) => ({ output: (state.output || '') + chunk })),
            clearOutput: () => set({ output: '' }),

            // Modo interactivo de la terminal embebida: cuando está activo,
            // el input al pie es visible y se puede escribir. Se desactiva
            // cuando se lanza un comando automático (runserver, etc.) que
            // usa el canal de sentinels en lugar de stdin directo.
            terminalActive: false,
            setTerminalActive: (active) => set({ terminalActive: !!active }),

            // Buffer del input controlado de la terminal.
            terminalInput: '',
            setTerminalInput: (value) =>
                set((state) => ({
                    terminalInput:
                        typeof value === 'function'
                            ? value(state.terminalInput ?? '')
                            : value,
                })),
        }),
        {
            name: 'project-store',
            storage: createJSONStorage(() => localStorage),
            // Solo rutas se persisten a disco. El resto (output, flags,
            // pythonVersion) vive solo en memoria: no se arrastra ruido entre
            // sesiones y los flags reflejan el estado real de la app actual.
            partialize: (state) => ({
                rutaProyecto: state.rutaProyecto,
                rutaEnv: state.rutaEnv,
            }),
        }
    )
);
