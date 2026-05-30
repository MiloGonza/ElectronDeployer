import { Link } from "react-router-dom";
import { motion } from "motion/react";

function AsideItem({ to, label, icon, path }) {
    const active = path === to;

    return (
        <Link to={to} className="block w-full">
            <div className="relative w-full overflow-visible px-4 py-1">
                {active && (
                    <motion.span
                        layoutId="sidebar-indicator"
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                        }}
                        className="
                      absolute left-0 top-1/2 z-20 h-11 w-[5px]
                      -translate-y-1/2 rounded-r-full
                      bg-[#F87D01]
                      blur-[0.2px]
                      shadow-[0_0_12px_rgba(248,125,1,1),0_0_26px_rgba(248,125,1,0.95),0_0_52px_rgba(248,125,1,0.6),0_0_80px_rgba(248,125,1,0.35)]
                    "/>
                )}

                <div
                    className={[
                        "ml-3 flex items-center gap-3 rounded-xl px-4 py-4 transition-all duration-300",
                        active
                            ? "bg-[#351C08] shadow-[0_0_0_1px_rgba(248,125,1,0.15)]"
                            : "hover:bg-[#23180f]",
                    ].join(" ")}
                >
                    {icon}

                    <span
                        className={
                            active
                                ? "text-[#FA7F02] font-medium"
                                : "text-white font-medium"
                        }
                    >
                        {label}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default AsideItem;