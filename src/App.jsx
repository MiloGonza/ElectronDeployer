import { Component } from "react";
import { Outlet } from "react-router-dom";


class App extends Component {
  state = {  } 
  render() { 
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Contenido */}
      <main>
        <Outlet />
      </main>
    </div>
    );
  }
}
 
export default App;