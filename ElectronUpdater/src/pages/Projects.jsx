import { useOutletContext } from "react-router-dom";

function Projects() {

    const context = useOutletContext();

    return (
        <article>
            Ruta actual: {context?.location?.pathname}
        </article>
    );
}

export default Projects;