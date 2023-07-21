/* 8️⃣ ***COMPONENTE CelularDetail*** 8️⃣

Implementar el componente CelularDetail. En este ejercicio tendrás que renderizar las diferentes propiedades del celular.
📢¡Sigue las instrucciones de los tests!📢

REQUISITOS
🟢 Tendrás que despachar una action con el "id" del celular cuando se monta el componente. Luego, traer esa 
información de tu estado global.
🟢 Tendrás que renderizar algunos datos del celular correspondiente.

IMPORTANTE
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
❗Este componente debe ser FUNCIONAL.
❗Para obtener el "id" puedes utilizar useParams.
❗Recuerda que las peticiones asíncronas a los servidores suelen demorar. Debes checkear tener disponible la información a utlizar.
❗NO hacer un destructuring de los hooks de React, debes utilizarlos con la siguiente forma:
      - 'React.useState' 
      - 'React.useEffect'
*/

import { useParams } from "react-router-dom";
import "./celularDetail.css";
import * as actions from "../../redux/actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CelularDetail = (props) => {
  const {id} = useParams();
  const dispatch = useDispatch()

  const celular = useSelector((state) => state.celularDetail)

  React.useEffect(()=> {
    dispatch(actions.getCelularDetails(id))
  }, [id])
  

  return (
  <div className="detail">
    <h1>{celular?.modelo}</h1>
    <img src={celular?.imagen} alt={celular?.modelo} />
    <h3>Precio: ${celular?.precio} USD</h3>
    <h5>Marca: {celular?.marca}</h5>
    <h5>Lanzamiento: {celular?.lanzamiento}</h5>
    <h5>Sistema Operativo: {celular?.sistemaOperativo}</h5>
    <h5>Descripción: {celular?.descripción}</h5>
  </div>
  );
};

export default CelularDetail;
