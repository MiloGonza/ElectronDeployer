import { useOutletContext } from "react-router-dom";

function Projects() {

    const context = useOutletContext();

    return (
        <div className="flex-1 p-10">
            Ruta actual: {context?.location?.pathname}
            <div className="flex flex-1 bg-red-500 h-96">
                as
            </div>
        </div>
    );
}

export default Projects;