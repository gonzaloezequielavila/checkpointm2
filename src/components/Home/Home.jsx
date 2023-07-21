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
import * as actions from '../../redux/actions'
import image from '../../img-cp2/main-image-cp2.jpg'
import CelularCard from '../CelularCard/CelularCard'



export class Home extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.getAllCelulares();
  }

  render() {
    return (
    <div className="home">
      <h1>Cellphones</h1>
      <img src={image} alt="celular-logo"/>
      <h3>Celulares:</h3>
      <h4>Checkpoint M2</h4>
      {this.props.celulares?.map((celu)=>{
        return <CelularCard 
        key={celu.id}
        id={celu.id}
        marca={celu.marca}
        precio={celu.precio}
        imagen={celu.imagen}
        modelo={celu.modelo}
        />
      })}
    </div>
    );
  }
}

export const mapStateToProps = (state) => {
  return{
    celulares: state.celulares,
  };
}

export const mapDispatchToProps = (dispatch) => {
  return{
    getAllCelulares: function(){
      dispatch(actions.getAllCelulares())
    },
    // getCelularDetails: function(details){
    //   dispatch(getCelularDetails(details))
    // },
    // createCelular: function(create){
    //   dispatch(createCelular(create))
    // },
    // deleteCelular: function(del){
    //   dispatch(deleteCelular(del))
    // },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
