export default function ProjectRapidActions({
    icon,
    label,
    script,
    color1,
    color2,
    borde,
    onClick,
    cwdTarget = 'project', // 'project' | 'env'
    onChange,
    onClickCustom,
}) {

    async function handleClick() {
        // Si el padre define un handler custom, gana sobre el flujo de
        // comando normal. Sirve para botones que no ejecutan nada en el
        // shell (p.ej. 'abrir terminal', que solo cambia el modo del UI).
        if (onClickCustom) {
            onClickCustom();
            return;
        }

        try {
            const result = onClick(script, cwdTarget);
            const ok = result instanceof Promise ? await result : true;
            if (ok) {
                onChange && onChange();
            }
        } catch {
            console.warn("onClick lanzó un error, no se ejecuta onChange");
        }
    }

    return (
        <button
            onClick={() => handleClick()}
            className="hover:cursor-pointer hover:scale-110 duration-300 flex flex-col relative items-center justify-center p-4 h-full rounded-xl border"
            style={{
                background: `linear-gradient(to bottom right, ${color1}, ${color2})`,
                borderColor: borde
            }}
        >
            <div>{icon}</div>

            <div className="flex flex-col text-center gap-1 max-w-full">
                <span>{label}</span>

                <span className="text-sm text-muted max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {script}
                </span>
                <span className="text-xs text-muted opacity-70">
                    cwd: {cwdTarget}
                </span>
            </div>
        </button>
    );
}
