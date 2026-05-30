import AsideBar from "./bars/AsideBar";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import AnimatedOutlet from "./components/layout/AnimatedOutlet";

export default function App() {

    const location = useLocation();
    const previousPath = useRef(location.pathname);

    useEffect(() => {
        previousPath.current = location.pathname;
    }, [location.pathname, previousPath]);

    return (
        <div className="flex h-screen overflow-hidden bg-primary">
            <AsideBar />

            <main className="flex-1 p-4">
                <AnimatedOutlet location={location} previousPath={previousPath} />
            </main>
        </div>
    );
}