/* 4️⃣ ***REDUCER*** 4️⃣ */

/* Importa las action-types aquí. */

const initialState = {
  celulares: [],
  celularDetail: {},
};

/*
En este ejercicio tendrás que crear los casos de un reducer para gestionar la información de tu estado global.
📢¡Sigue las instrucciones de los tests!📢
REQUISITOS:
🟢 Crea un caso default, que devuelva el estado global sin cambios.
🟢 Crea un caso en el que, dentro del estado "celulares", se guarden todos los celulares.
🟢 Crea un caso en el que, dentro del estado "celularDetail", se guarde el detalle de un celular.
🟢 Crea un caso en el que, dentro del estado "celulares", se agregue un nuevo celular.
    [PISTA]: puedes utilizar el spread operator.
🟢 Crea un caso en el que, dentro del estado "celulares", se elimine aquel celular cuyo ID es igual al recibido.
*/

const rootReducer = (state = initialState, action) => {
  switch (
    action.type
    //aca va tu codigo
  ) {
  }
};

export default rootReducer;
