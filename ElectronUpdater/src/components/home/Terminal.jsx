import { useEffect, useMemo, useRef } from "react";

/**
 * Terminal estilo macOS para mostrar el output de comandos.
 *
 * Props:
 * - output:       string acumulado (texto crudo del shell).
 * - title:        texto que aparece en la cabecera de la "ventana".
 * - onClear:      handler para vaciar la salida.
 * - showTimestamp: si true, antepone [HH:MM:SS] a cada línea.
 * - status:       "idle" | "running" | "error" — colorea el punto central.
 * - active:       si true, muestra una línea de input al pie para escribir
 *                 comandos directamente al shell persistente.
 * - inputValue:   valor controlado del input (string).
 * - onInputChange: setter del input (string | (prev) => string).
 * - onSubmit:     handler de Enter. Recibe el texto y debe enviarlo al shell.
 * - onInterrupt:  handler de Ctrl+C. Debe mandar ^C al shell.
 */
function Terminal({
    output = "",
    title = "bash",
    onClear,
    showTimestamp = true,
    status = "idle",
    active = false,
    inputValue = "",
    onInputChange,
    onSubmit,
    onInterrupt,
    actions,
}) {
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll al fondo cada vez que crece el output.
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [output]);

    // Cuando la terminal se activa, llevamos el foco al input para que
    // el usuario pueda escribir sin tener que hacer click.
    useEffect(() => {
        if (active && inputRef.current) {
            inputRef.current.focus();
        }
    }, [active]);

    const formatted = useMemo(() => buildLines(output, showTimestamp), [output, showTimestamp]);

    const statusDot =
        status === "error"
            ? "bg-danger"
            : status === "running"
                ? "button-success animate-pulse"
                : "bg-muted";

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = (inputValue ?? "").trim();
            if (!value) return;
            onSubmit?.(value);
            onInputChange?.("");
        } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onInterrupt?.();
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-bg-secondary overflow-hidden bg-primary shadow-lg shadow-black/30">
            {/* Cabecera tipo ventana macOS */}
            <header className="flex items-center gap-3 px-4 py-2.5 bg-secondary border-b border-bg-secondary select-none">
                <div className="flex items-center gap-2">
                    {/* <span className="w-3 h-3 rounded-full bg-danger" title="cerrar" />
                    <span className="w-3 h-3 rounded-full bg-warning" title="minimizar" /> */}
                    <span
                        className={`w-3 h-3 rounded-full ${statusDot}`}
                        title={status === "running" ? "ejecutando" : "inactivo"}
                    />
                </div>
                <div className="flex-1 text-center text-xs text-muted font-mono truncate">
                    {title}
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                    {onClear ? (
                        <button
                            onClick={onClear}
                            className="text-xs px-2 py-1 rounded-md text-muted hover:text-app hover:bg-primary transition-colors cursor-pointer"
                        >
                            Limpiar
                        </button>
                    ) : (
                        <span className="w-12" />
                    )}
                </div>
            </header>

            {/* Cuerpo scrollable */}
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin p-4 font-mono text-[13px] leading-relaxed"
            >
                {formatted.length === 0 ? (
                    <EmptyState />
                ) : (
                    formatted.map((line, idx) => (
                        <LogLine key={idx} line={line} isLast={idx === formatted.length - 1} />
                    ))
                )}
            </div>

            {/* Input interactivo: solo visible cuando active=true. */}
            {active && (
                <div className="flex items-center gap-2 border-t border-bg-secondary px-4 py-2 bg-primary">
                    <span className="text-accent font-mono text-[13px] select-none">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => onInputChange?.(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        placeholder="Escribe un comando y presiona Enter (Ctrl+C para interrumpir)…"
                        className="flex-1 min-w-0 bg-transparent outline-none font-mono text-[13px] text-app placeholder:text-muted/60"
                    />
                </div>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex items-center gap-2 text-muted">
            <span className="text-accent">$</span>
            <span>Esperando comandos…</span>
            <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1" />
        </div>
    );
}

function LogLine({ line, isLast }) {
    const isPrompt = line.raw.startsWith(">");
    const colorClass = isPrompt
        ? "text-accent"
        : line.level === "error"
            ? "text-danger"
            : line.level === "warning"
                ? "text-warning"
                : line.level === "success"
                    ? "text-success"
                    : "text-gray-300";

    return (
        <div className="flex items-start gap-2 whitespace-pre-wrap break-words">
            {line.timestamp && (
                <span className="text-muted/70 shrink-0">[{line.timestamp}]</span>
            )}
            <span className={`${colorClass} flex-1 min-w-0`}>
                {line.raw}
                {isLast && <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-middle" />}
            </span>
        </div>
    );
}

// --- helpers ---------------------------------------------------------------

const ERROR_RE = /\b(error|err|traceback|exception|fatal|fail(ed|ure)?|errno)\b/i;
const WARN_RE = /\b(warning|warn|deprecat|cuidado)\b/i;
const OK_RE = /\b(success|started|listening|running on|ok|done|ready|✓)\b/i;

function classify(text) {
    if (ERROR_RE.test(text)) return "error";
    if (WARN_RE.test(text)) return "warning";
    if (OK_RE.test(text)) return "success";
    return "info";
}

function buildLines(output, showTimestamp) {
    if (!output) return [];
    const text = typeof output === "string" ? output : String(output);
    return text.split(/\r?\n/).map((raw) => {
        // No clasificar timestamps internos ni ruido del propio shell.
        const trimmed = raw.replace(/\s+$/, "");
        return {
            raw: trimmed,
            timestamp: showTimestamp ? nowHMS() : "",
            level: classify(trimmed),
        };
    });
}

function nowHMS() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default Terminal;
