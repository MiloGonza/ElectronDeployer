import { useOutletContext } from "react-router-dom";


function Home() {
    const context = useOutletContext();
    return (
        <article>
            Ruta actual: {context?.location?.pathname}
            <div className="flex flex-1 bg-red-500">

            </div>
        </article>
    );
}

export default Home;