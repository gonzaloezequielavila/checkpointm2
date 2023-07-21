/* 2️⃣ ***COMPONENTE NAV*** 2️⃣
Implementar el componente Nav. En este ejercicio tendrás que asociar dos etiquetas Link to='' a 
distintos elementos.

REQUISITOS
🟢 El primer <Link> debe dirigir a "/" con el texto "Home".
🟢 El segundo <Link> debe dirigir a "/celulares/create" con el texto "Create Celular".

IMPORTANTE
❗Este componente debe ser FUNCIONAL.
*/

import "./nav.css";

import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
  <div className="nav">
    <Link to="/"><a>Home</a></Link>
    
    <Link to="/celulares/create"><a>Create Celular</a></Link>

  </div>);
};

export default Nav;
