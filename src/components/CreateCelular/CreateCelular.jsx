/* 6️⃣ ***COMPONENTE CreateCelular*** 6️⃣
Implementar el componente CreateCelular. Este consistirá en un formulario controlado con estados de react.
📢¡Sigue las instrucciones de los tests!📢
REQUISITOS
🟢 Aquí tendrás que renderizar una serie de elementos HTML con distintos atibutos e información dentro.
🟢 Debes manejar cada uno de los inputs de tu formulario mediante un estado local llamado "input".
🟢 La información del formulario se debe despachar al estado global cuando se hace un submit.
🟢 Debes manejar los errores que pueden tener los inputs del formulario.
IMPORTANTE
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
❗Este componente debe ser funcional.
❗¡Puedes implementar el manejo de errores como mejor prefieras! Sólo recuerda renderizar el error apropiado en cada caso.
❗NO hacer un destructuring de los hooks de React, debes utilizarlos con la siguiente forma:
      - 'React.useState'
      - 'React.useEffect'
*/

import * as Redux from "react-redux";
import * as actions from "../../redux/actions";
import { useDispatch } from "react-redux";

import React from "react";

const validation = (state) => {
  const errors = {}

  if(state.marca.length > 30) {errors.marca = "Nombre de marca demasiado largo"}
  if(state.modelo.length > 30) {errors.modelo = "Nombre de modelo demasiado largo"}
  if(state.precio <= 30) {errors.precio = "El precio del celular tiene que ser mayor a 0"}

  return errors
}

const CreateCelular = () => {
  const [input, setInput] = React.useState({
    marca: "",
    modelo: "",
    precio: 0,
    descripción: "",
    sistemaOperativo: "",
    imagen: "",
    lanzamiento: ""
  });

  const [errors, setErrors] = React.useState({
    marca: "",
    modelo: "",
    precio: ""
  })

  const dispatch = useDispatch()

  const handleChange = (event) => {
    const property = event.target.name;
    const value = event.target.value;

    setInput({...input, [property]: value})
    setErrors(validation({...input, [property]:value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if(errors.marca === "" && errors.precio === "" && errors.precio === ""){
      dispatch(actions.createCelular(input));
    }
  }


  return (
  <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Marca: </label>
        <input type="text" name="marca" onChange={handleChange}></input>
        {errors.marca && (<p>{errors.marca}</p>)}
      </div>
      <div>
        <label>Modelo: </label>
        <input type="text" name="modelo" onChange={handleChange}></input>
        {errors.modelo && (<p>{errors.modelo}</p>)}
      </div>
      <div>
        <label>Precio: </label>
        <input type="number" name="precio" onChange={handleChange}></input>
        {errors.precio && (<p>{errors.precio}</p>)}
      </div>
      <div>
        <label>Descripción: </label>
        <textarea type="text" name="descripción" onChange={handleChange}></textarea>
      </div>
      <div>
        <label>Sistema Operativo: </label>
        <input type="text" name="sistemaOperativo" onChange={handleChange}></input>
      </div>
      <div>
        <label>Imagen: </label>
        <input type="text" name="imagen" onChange={handleChange}></input>
      </div>
      <div>
        <label>Lanzamiento: </label>
        <input type="text" name="lanzamiento" onChange={handleChange}></input>
      </div>
      <button type="submit">Crear Celular</button>
    </form>
  </div>
);
};

// export const mapStateToProps = (state) => {
//   return {
//     celulares: state.celulares
//   }
// }

// export const mapDispatchToProps = (dispatch) =>{
//   return{
//     createCelular: function(newPhone){
//       dispatch(createCelular(newPhone));
//     },
//   };
// };

export default CreateCelular;
