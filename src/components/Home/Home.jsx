/*5️⃣ ***COMPONENTE Home*** 5️⃣
Implementar el componente Home. Este deberá renderizar todos los celulars (Cards) que contengan la 
información consumida directamente del estado global de Redux. 
📢¡Sigue las instrucciones de los tests!📢
REQUISITOS
🟢 Tendrás que conectar el componente con el estado global de Redux mediante dos funciones: mapStateToProps y 
mapDispatchToProps.
🟢 Tendrás que renderizar una serie de etiquetas HTML con información dentro.
🟢 Tendrás que mappear tu estado global para luego renderizar su información utilizando el componente <celularCard />.
IMPORTANTE
❗Este componente debe ser de CLASE.
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
 [Ej]: import * as actions from "./../../redux/actions/index";
*/

import "./home.css";

import React, { Component } from "react";
import { connect } from "react-redux";

export class Home extends Component {
  render() {
    return <div className="home"></div>;
  }
}

export const mapStateToProps = (state) => {};

export const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
