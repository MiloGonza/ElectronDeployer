import { useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

const routeOrder = {
    "/": 0,
    "/proyectos": 1,
};

export default function AnimatedOutlet({ location, previousPath }) {
    const currentIndex = routeOrder[location.pathname] ?? 0;
    const previousIndex = routeOrder[previousPath.current] ?? 0;

    const direction =
        currentIndex >= previousIndex ? "backward" : "forward";

    const contextData = {
        location,
        previousPath: previousPath.current,
    };

    const outlet = useOutlet(contextData);

    const variants = {
        enter: (direction) => ({
            y: direction === "forward" ? "-100%" : "100%",
            scale: 0.98,
            opacity: 0,
        }),
        center: {
            y: 0,
            scale: 1,
            opacity: 1,
        },
        exit: (direction) => ({
            y: direction === "forward" ? "100%" : "-100%",
            scale: 0.98,
            opacity: 0,
        }),
    };

    return (
        <div className="relative h-full min-h-0 overflow-hidden rounded-3xl">
            <AnimatePresence
                mode="sync"
                initial={false}
                custom={direction}
            >
                <motion.div
                    key={location.pathname}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-3xl border border-white"
                >
                    <div className="h-full w-full overflow-auto p-6 text-zinc-100">
                        {outlet}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}