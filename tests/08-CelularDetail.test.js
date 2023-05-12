import * as ReactRedux from "react-redux";
import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import CelularDetail from "../src/components/CelularDetail/CelularDetail";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import Router from "react-router-dom";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });

jest.mock("../src/redux/actions/index.js", () => ({
  getCelularDetails: () => ({
    type: "GET_CELULAR_DETAIL",
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "12",
  }),
}));

describe("<CelularDetail />", () => {
  global.fetch = nodeFetch;
  let celularDetail, useSelectorStub, useSelectorFn, useEffect;
  const noProd = {
    id: 1,
    marca: "Sony",
    modelo: "Xperia Pro",
    precio: 2000,
    descripción:
      "este Xperia llega con el Qualcomm Snapdragon 888, una pantalla OLED 4K a 120Hz y 512 GB de memoria interna.",
    sistemaOperativo: "Android 10",
    imagen:
      "https://moviles.info/wp-content/uploads/2021/01/Sony-Xperia-Pro.png.webp",
    lanzamiento: "26/01/2021",
  };

  const match = (id) => ({
    params: { id },
    isExact: true,
    path: "/celulares/:id",
    url: `/celulares/${id}`,
  });
  const mockStore = configureStore([thunk]);

  const store = (id) => {
    let state = {
      celulares: data.celulares.concat(noProd),
      celularDetail:
        id !== 10 ? data.celulares[id - 1] : data.celulares.concat(noProd),
    };
    return mockStore(state);
  };
  // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
  // También fijate que vas a tener que usar algunos hooks. Tanto de React como de Redux!
  // Los hooks de React si o si los tenes que usar "React.useState", "React.useEffect". El test no los reconoce
  // cuando se hace destructuring de estos métodos === test no corren.
  beforeAll(() => expect(isReact.classComponent(CelularDetail)).toBeFalsy());
  const mockUseEffect = () => useEffect.mockImplementation((fn) => fn());

  beforeEach(() => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/celulares" => Retorna la propiedad celulares del archivo data.json
    apiMock.get("/celulares").reply(200, data.celulares);

    // "/celulares/:id" => Retorna un celular matcheado por su id

    let id = null;
    apiMock
      .get((uri) => {
        id = Number(uri.split("/").pop()); // Number('undefined') => NaN
        return !!id;
      })
      .reply(200, (uri, requestBody) => {
        return data.celulares.find((celular) => celular.id === id) || {};
      });
    useSelectorStub = jest.spyOn(ReactRedux, "useSelector");
    useSelectorFn = (id) =>
      useSelectorStub.mockReturnValue(store(id).getState().celularDetail);
    useEffect = jest.spyOn(React, "useEffect");
    celularDetail = (id) =>
      mount(
        <ReactRedux.Provider store={store(id)}>
          <MemoryRouter initialEntries={[`/celulares/${id}`]}>
            <CelularDetail match={match(id)} />
          </MemoryRouter>
        </ReactRedux.Provider>
      );
    mockUseEffect();
    mockUseEffect();
  });

  afterEach(() => jest.restoreAllMocks());

  // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
  // import * as actions from "./../../redux/actions/index";

  it('Debe utilizar React.useEffect para que despache la acción "getCelularDetails", pasándole como argumento el ID del celular', async () => {
    // Nuevamente testeamos todo el proceso. Tenes que usar un useEffect, y despachar la acción "getCelularDetails".
    const useDispatch = jest.spyOn(ReactRedux, "useDispatch");
    const getCelularDetails = jest.spyOn(actions, "getCelularDetails");
    celularDetail(1);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getCelularDetails).toHaveBeenCalled();

    celularDetail(2);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getCelularDetails).toHaveBeenCalled();
  });

  it("Debe llamar a la función useParams y obtener el id", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ id: "1" });
    celularDetail();
    expect(Router.useParams).toHaveBeenCalled();
  });

  describe('Debe utilizar el "id" de "params" para despachar la action "getCelularDetails" y renderizar los detalles del celular', () => {
    const celulares = data.celulares[0];
    // Fijate que para traerte los datos desde Redux, vas a tener que usar el hook de Redux "useSelector"
    // para que los tests pasen!
    // Lo que se esta testeando aca, es que el componente renderice los detalles del todo correctamente,
    // no la estructura del componente asi que eres libre de diseñar la estructura, siempre y cuando se muestren los datos del todo.
    // Verificar la llegada del id proveniente de useParams, puede romper en el caso que no exista nada.
    it("Debe renderizar un tag 'h1' que muestre el modelo de cada 'celular'", () => {
      useSelectorFn(1);
      expect(celularDetail(1).text().includes(celulares.modelo)).toEqual(true);
      expect(celularDetail(1).find("h1").at(0).text()).toBe(celulares.modelo);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });

    it("Debe renderizar una etiqueta 'img' donde su prop 'src' sea la imagen del celular y la prop 'alt' el modelo del celular.", () => {
      useSelectorFn(1);
      expect(celularDetail(1).find("img").prop("src")).toBe(celulares.imagen);
      expect(celularDetail(1).find("img").prop("alt")).toBe(celulares.modelo);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });

    it("Debe renderizar una etiqueta 'h3' que contenga el texto 'Precio: ' y el precio del celular.", () => {
      useSelectorFn(1);
      expect(celularDetail(1).text().includes(celulares.precio)).toEqual(true);
      expect(celularDetail(1).find("h3").at(0).text()).toBe(
        `Precio: ${"$" + celulares.precio} USD`
      );
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });

    it("Debe renderizar una etiqueta 'h5' que contenga el texto 'Marca: ' y la marca del celular.", () => {
      useSelectorFn(1);
      expect(celularDetail(1).text().includes(celulares.marca)).toEqual(true);
      expect(celularDetail(1).find("h5").at(0).text()).toBe(
        "Marca: " + celulares.marca
      );
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });

    it("Debe renderizar una etiqueta 'h5' que contenga el texto 'Lanzamiento: ' y el Lanzamiento del celular.", () => {
      useSelectorFn(1);
      expect(celularDetail(1).text().includes(celulares.lanzamiento)).toEqual(
        true
      );
      expect(celularDetail(1).find("h5").at(1).text()).toBe(
        "Lanzamiento: " + celulares.lanzamiento
      );
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });

    it("Debe renderizar una etiqueta 'h5' que contenga el texto 'Sistema Operativo: ' y el Sistema Operativo del celular.", () => {
      useSelectorFn(1);
      expect(
        celularDetail(1).text().includes(celulares.sistemaOperativo)
      ).toEqual(true);
      expect(celularDetail(1).find("h5").at(2).text()).toBe(
        "Sistema Operativo: " + celulares.sistemaOperativo
      );
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it("Debe renderizar una etiqueta 'h5' que contenga el texto 'Descripción: ' y la Descripción del celular.", () => {
      useSelectorFn(1);
      expect(celularDetail(1).text().includes(celulares.descripción)).toEqual(
        true
      );
      expect(celularDetail(1).find("h5").at(3).text()).toBe(
        "Descripción: " + celulares.descripción
      );
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
  });
});
