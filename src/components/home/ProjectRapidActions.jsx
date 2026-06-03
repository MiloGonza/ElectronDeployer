export default function ProjectRapidActions({
    icon,
    label,
    script,
    color1,
    color2,
    borde,
    onClick
}) {
    return (
        <button
            onClick={() => onClick(script)}
            className="hover:cursor-pointer hover:scale-110 duration-300 flex flex-col items-center justify-center p-4 h-full rounded-xl border"
            style={{
                background: `linear-gradient(to bottom right, ${color1}, ${color2})`,
                borderColor: borde
            }}
        >
            <div>{icon}</div>

            <div className="flex flex-col text-center gap-1">
                <span>{label}</span>

                <span className="text-sm text-muted">
                    {script}
                </span>
            </div>
        </button>
    );
}