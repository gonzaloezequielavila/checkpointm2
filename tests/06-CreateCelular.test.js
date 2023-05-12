import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import CreateCelular from "../src/components/CreateCelular/CreateCelular";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });

jest.mock("../src/redux/actions/index", () => ({
  CREATE_CELULAR: "CREATE_CELULAR",
  createCelular: (payload) => ({
    type: "CREATE_CELULAR",
    payload: {
      ...payload,
      id: 6,
    },
  }),
}));

describe("<CreateCelular/>", () => {
  const state = { celulares: data.celulares };
  const mockStore = configureStore([thunk]);
  const { CREATE_CELULAR } = actions;

  beforeAll(() => expect(isReact.classComponent(CreateCelular)).toBeFalsy());

  // RECUERDA USAR FUNCTIONAL COMPONENT EN LUGAR DE CLASS COMPONENT
  describe("Formulario de creación de celulares", () => {
    let createCelular;
    let store = mockStore(state);
    beforeEach(() => {
      createCelular = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/celulares/create"]}>
            <CreateCelular />
          </MemoryRouter>
        </Provider>
      );
    });

    it("Debe renderizar un formulario", () => {
      expect(createCelular.find("form").length).toBe(1);
    });

    it('Debe renderizar un label con el texto "Marca: "', () => {
      expect(createCelular.find("label").at(0).text()).toEqual("Marca: ");
    });

    it('Debe renderizar un input de tipo text con el atributo "name" igual a "marca"', () => {
      expect(createCelular.find('input[name="marca"]').length).toBe(1);
    });

    it('Debe renderizar un label con el texto "Modelo: "', () => {
      expect(createCelular.find("label").at(1).text()).toBe("Modelo: ");
    });

    it('Debe renderizar un input de tipo text con el atributo "name" igual a "modelo"', () => {
      expect(createCelular.find('input[name="modelo"]').length).toBe(1);
    });

    it('Debe renderizar un label con el texto "Precio: "', () => {
      expect(createCelular.find("label").at(2).text()).toBe("Precio: ");
    });

    it('Debe renderizar un input de tipo number con el atributo "name" igual a "precio"', () => {
      expect(createCelular.find('input[name="precio"]').length).toBe(1);
      expect(createCelular.find('input[type="number"]').length).toBe(1);
    });

    it('Debe renderizar un label con el texto "Descripción: "', () => {
      expect(createCelular.find("label").at(3).text()).toBe("Descripción: ");
    });

    it('Debe renderizar un input de tipo textarea con el atributo "name" igual a "descripción"', () => {
      expect(createCelular.find('textarea[name="descripción"]').length).toBe(1);
    });

    it('Debe renderizar un label con el texto "Sistema Operativo: "', () => {
      expect(createCelular.find("label").at(4).text()).toBe(
        "Sistema Operativo: "
      );
    });

    it('Debe renderizar un input de tipo text con el atributo "name" igual a "sistemaOperativo"', () => {
      expect(createCelular.find('input[name="sistemaOperativo"]').length).toBe(
        1
      );
    });

    it('Debe renderizar un label con el texto "Imagen: "', () => {
      expect(createCelular.find("label").at(5).text()).toBe("Imagen: ");
    });
    it('Debe renderizar un input de tipo text con el atributo name igual a "imagen"', () => {
      expect(createCelular.find('input[name="imagen"]').length).toBe(1);
    });

    it('Debe renderizar un label con el texto "Lanzamiento: "', () => {
      expect(createCelular.find("label").at(6).text()).toEqual("Lanzamiento: ");
    });
    it('Debe renderizar un input de tipo text con el atributo "name" igual a "lanzamiento"', () => {
      expect(createCelular.find('input[name="lanzamiento"]').length).toBe(1);
    });

    it('Debe renderizar un button de tipo submit con el texto "Crear Celular"', () => {
      expect(createCelular.find('button[type="submit"]').length).toBe(1);
      expect(createCelular.find('button[type="submit"]').text()).toBe(
        "Crear Celular"
      );
    });
  });

  describe("Manejo de estados locales", () => {
    let useState, useStateSpy, createCelular;
    let store = mockStore(state);
    beforeEach(() => {
      useState = jest.fn();
      useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation((initialState) => [
        initialState,
        useState,
      ]);

      createCelular = mount(
        <Provider store={store}>
          <CreateCelular />
        </Provider>
      );
    });

    // Revisen bien que tipo de dato utilizamos en cada propiedad.
    it('Debe inicializar el estado local con las propiedades: "marca", "modelo", "precio", "descripción", "sistemaOperativo", "imagen" y "lanzamiento"', () => {
      expect(useStateSpy).toHaveBeenCalledWith({
        marca: "",
        modelo: "",
        precio: 0,
        descripción: "",
        sistemaOperativo: "",
        imagen: "",
        lanzamiento: "",
      });
    });

    describe("Debe reconocer cuando hay un cambio de valor en los distintos inputs", () => {
      it('input "marca"', () => {
        createCelular.find('input[name="marca"]').simulate("change", {
          target: { name: "marca", value: "Samsung" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "Samsung",
          modelo: "",
          precio: 0,
          descripción: "",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });

        createCelular.find('input[name="marca"]').simulate("change", {
          target: { name: "marca", value: "iPhone2" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "iPhone2",
          modelo: "",
          precio: 0,
          descripción: "",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });
      });

      it('input "modelo"', () => {
        createCelular.find('input[name="modelo"]').simulate("change", {
          target: { name: "modelo", value: "Note 10" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "Note 10",
          precio: 0,
          descripción: "",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });

        createCelular.find('input[name="modelo"]').simulate("change", {
          target: { name: "modelo", value: "X pro" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "X pro",
          precio: 0,
          descripción: "",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });
      });

      it('input "precio"', () => {
        createCelular.find('input[name="precio"]').simulate("change", {
          target: { name: "precio", value: 2000 },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 2000,
          descripción: "",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });
      });

      it('input "descripción"', () => {
        createCelular.find('textarea[name="descripción"]').simulate("change", {
          target: { name: "descripción", value: "El mejor celular" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 0,
          descripción: "El mejor celular",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });

        createCelular.find('textarea[name="descripción"]').simulate("change", {
          target: {
            name: "descripción",
            value: "Tiene una super pantalla",
          },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 0,
          descripción: "Tiene una super pantalla",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "",
        });
      });

      it('input "sistemaOperativo"', () => {
        createCelular
          .find('input[name="sistemaOperativo"]')
          .simulate("change", {
            target: { name: "sistemaOperativo", value: "Android 11" },
          });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 0,
          descripción: "",
          sistemaOperativo: "Android 11",
          imagen: "",
          lanzamiento: "",
        });

        createCelular
          .find('input[name="sistemaOperativo"]')
          .simulate("change", {
            target: { name: "sistemaOperativo", value: "ios 12" },
          });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 0,
          descripción: "",
          sistemaOperativo: "ios 12",
          imagen: "",
          lanzamiento: "",
        });
      });

      it('input "imagen"', () => {
        createCelular.find('input[name="imagen"]').simulate("change", {
          target: { name: "imagen", value: "imagen1" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 0,
          descripción: "",
          sistemaOperativo: "",
          imagen: "imagen1",
          lanzamiento: "",
        });
      });

      it('input "lanzamiento"', () => {
        createCelular.find('input[name="lanzamiento"]').simulate("change", {
          target: { name: "lanzamiento", value: "26/01/2021" },
        });
        expect(useState).toHaveBeenCalledWith({
          marca: "",
          modelo: "",
          precio: 0,
          descripción: "",
          sistemaOperativo: "",
          imagen: "",
          lanzamiento: "26/01/2021",
        });
      });
    });
  });

  describe("Dispatch al store", () => {
    // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
    // import * as actions from "./../../redux/actions/index";

    let createCelular, useState, useStateSpy;
    let store = mockStore(state);

    beforeEach(() => {
      useState = jest.fn();
      useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation((initialState) => [
        initialState,
        useState,
      ]);
      store = mockStore(state, actions.createCelular);
      store.clearActions();
      createCelular = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/celulares/create"]}>
            <CreateCelular />
          </MemoryRouter>
        </Provider>
      );
    });

    afterEach(() => jest.restoreAllMocks());

    it('Debe despachar la action "CreateCelular" con los datos del estado local cuando se haga submit del form.', () => {
      const createCelularFn = jest.spyOn(actions, "createCelular");
      createCelular.find("form").simulate("submit");
      expect(store.getActions()).toEqual([
        {
          type: CREATE_CELULAR,
          payload: {
            marca: "",
            modelo: "",
            precio: 0,
            descripción: "",
            sistemaOperativo: "",
            imagen: "",
            lanzamiento: "",
            id: 6,
          },
        },
      ]);
      expect(CreateCelular.toString().includes("useDispatch")).toBe(true);
      expect(createCelularFn).toHaveBeenCalled();
    });

    it('Debe evitar que se refresque la página luego de hacer submit con el uso del evento "preventDefault"', () => {
      const event = { preventDefault: () => {} };
      jest.spyOn(event, "preventDefault");
      createCelular.find("form").simulate("submit", event);
      expect(event.preventDefault).toBeCalled();
    });
  });

  describe("Manejo de errores", () => {
    let createCelular;
    let store = mockStore(state);
    beforeEach(() => {
      createCelular = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/celulares/create"]}>
            <CreateCelular />
          </MemoryRouter>
        </Provider>
      );
    });

    it("Al ingresar un 'marca' con una longitud mayor a 30 caracteres, debe renderizar un <p> indicando el error", () => {
      // Pueden implementar la lógica de validación de errores de la forma que mejor prefieran!
      // Los test verifican principalmente que muestres lo errores en la interfaz CORRECTAMENTE.
      jest.restoreAllMocks();
      expect(createCelular.find("p").length).toEqual(0);
      createCelular.find('input[name="marca"]').simulate("change", {
        target: {
          name: "marca",
          value: "Samsung galaxy super note 10 ultra hd plus",
        },
      });
      expect(createCelular.find("p").at(0).text()).toEqual(
        "Nombre de marca demasiado largo"
      );
      // Al insertar un valor correcto en el input, el "p" deberia desaparecer
      createCelular.find('input[name="marca"]').simulate("change", {
        target: { name: "marca", value: "Samsung" },
      });
      createCelular.find('input[name="precio"]').simulate("change", {
        target: { name: "precio", value: 150 },
      });
      expect(createCelular.find("p").length).toEqual(0);
    });

    it("Al ingresar un 'modelo' con una longitud mayor a 30 caracteres, debe renderizar un <p> indicando el error", () => {
      jest.restoreAllMocks();
      expect(createCelular.find("p").length).toEqual(0);
      createCelular.find('input[name="modelo"]').simulate("change", {
        target: {
          name: "modelo",
          value: "Super pro premium quality note plus koreano",
        },
      });
      createCelular.find('input[name="precio"]').simulate("change", {
        target: {
          name: "precio",
          value: 150,
        },
      });
      expect(createCelular.find("p").at(0).text()).toEqual(
        "Nombre de modelo demasiado largo"
      );
      createCelular.find('input[name="modelo"]').simulate("change", {
        target: { name: "modelo", value: "Note 10" },
      });
      createCelular.find('input[name="precio"]').simulate("change", {
        target: { name: "precio", value: 150 },
      });
      expect(createCelular.find("p").length).toEqual(0);
    });

    it("Al ingresar un 'precio' menor a 0, debe renderizar un <p> indicando el error", () => {
      jest.restoreAllMocks();
      createCelular.find('input[name="precio"]').simulate("change", {
        target: { name: "precio", value: -321 },
      });
      expect(createCelular.find("p").text()).toEqual(
        "El precio del celular tiene que ser mayor a 0"
      );
      // Al insertar un valor correcto en el input, el "p" deberia desaparecer
      createCelular.find('input[name="precio"]').simulate("change", {
        target: { name: "precio", value: 100 },
      });
      expect(createCelular.find("p").length).toEqual(0);
    });
    it("Si hay errores, no deberia despachar la action", () => {
      const dispatchSpy = jest.spyOn(actions, "createCelular");
      // Corrobora varias veces de que si hay algun error, no se despache la action
      createCelular.find('input[name="modelo"]').simulate("change", {
        target: {
          name: "modelo",
          value: "Super pro premium quality note plus koreano",
        },
      });
      createCelular.find("button").simulate("submit");
      expect(dispatchSpy).not.toHaveBeenCalled();
      createCelular.find('input[name="marca"]').simulate("change", {
        target: {
          name: "marca",
          value: "Samsung galaxy super note 10 ultra hd plus",
        },
      });
      expect(dispatchSpy).not.toHaveBeenCalled();
      createCelular.find("button").simulate("submit");
      createCelular.find('input[name="precio"]').simulate("change", {
        target: { name: "precio", value: -32 },
      });
      createCelular.find("button").simulate("submit");
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
