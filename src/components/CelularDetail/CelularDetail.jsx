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

import "./celularDetail.css";

import React from "react";

const CelularDetail = (props) => {
  return <div className="detail"></div>;
};

export default CelularDetail;
