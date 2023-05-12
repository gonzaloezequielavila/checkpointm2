import thunk from "redux-thunk";
import * as data from "../db.json";
import { Provider } from "react-redux";
import { configure, mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Link, MemoryRouter } from "react-router-dom";
import * as actions from "../src/redux/actions/index";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import CelularCardConnected from "../src/components/CelularCard/CelularCard";

configure({ adapter: new Adapter() });

jest.mock("../src/redux/actions/index", () => ({
  deleteCelular: () => ({
    type: "DELETE_CELULAR",
  }),
}));

describe("<CelularCard />", () => {
  let celularCard, state, store;
  const mockStore = configureStore([thunk]);
  let celulares = data.celulares;
  state = {
    celulares: [],
    celularDetail: {},
  };
  store = mockStore(state);
  beforeEach(() => {
    celularCard = (celular) =>
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <CelularCardConnected
              id={celular.id}
              modelo={celular.modelo}
              imagen={celular.imagen}
              marca={celular.marca}
              sistemaOperativo={celular.sistemaOperativo}
              precio={celular.precio}
            />
          </MemoryRouter>
        </Provider>
      );
  });

  afterEach(() => jest.restoreAllMocks());

  describe("Estructura", () => {
    it('Debe renderizar un botón con el texto "x"', () => {
      const wrapper = celularCard(celulares[0]);
      expect(wrapper.find("button").text()).toBe("x");
    });

    it('Debe renderizar un "h3" que muestre la propiedad {modelo} de cada celular', () => {
      expect(celularCard(celulares[0]).find("h3").at(0).text()).toBe(
        "Xperia Pro"
      );
      expect(celularCard(celulares[1]).find("h3").at(0).text()).toBe("Edge S");
      expect(celularCard(celulares[2]).find("h3").at(0).text()).toBe(
        "Nova 8 Pro"
      );
    });

    it('Debe renderizar la imagen de cada celular y un atributo "alt" con el nombre del modelo', () => {
      expect(celularCard(celulares[0]).find("img").prop("src")).toBe(
        celulares[0].imagen
      );
      expect(celularCard(celulares[0]).find("img").prop("alt")).toBe(
        celulares[0].modelo
      );
      expect(celularCard(celulares[1]).find("img").prop("src")).toBe(
        celulares[1].imagen
      );
      expect(celularCard(celulares[1]).find("img").prop("alt")).toBe(
        celulares[1].modelo
      );
    });

    it('Debe renderizar un <p> que contenga el texto "Marca: " seguido de la propiedad {marca} de cada celular', () => {
      expect(celularCard(celulares[4]).find("p").at(0).text()).toBe(
        "Marca: Samsung"
      );
      expect(celularCard(celulares[3]).find("p").at(0).text()).toBe(
        "Marca: iPhone"
      );
      expect(celularCard(celulares[2]).find("p").at(0).text()).toBe(
        "Marca: Huawei"
      );
    });

    it('Debe renderizar un <h4> que contenga el texto "Precio: " seguido de la propiedad {precio} de cada celular, de la siguiente manera: Ej: "Precio: $400 USD"', () => {
      expect(celularCard(celulares[0]).find("h4").at(0).text()).toBe(
        "Precio: $2000 USD"
      );
      expect(celularCard(celulares[1]).find("h4").at(0).text()).toBe(
        "Precio: $236 USD"
      );
      expect(celularCard(celulares[4]).find("h4").at(0).text()).toBe(
        "Precio: $1000 USD"
      );
    });

    it('Debe asociar una etiqueta <Link> con el {modelo} de cada celular como texto y redirigir a "/celulares/:id"', () => {
      expect(celularCard(celulares[0]).find(Link)).toHaveLength(1);
      expect(celularCard(celulares[0]).find(Link).at(0).prop("to")).toEqual(
        "/celulares/1"
      );
    });

    it('Debe hacer un dispatch al estado global utilizando la action "deleteCelular" al hacer click en el botón "x". Debe pasarle el ID del celular', () => {
      const deleteCelularspy = jest.spyOn(actions, "deleteCelular");
      const celularCard = mount(
        <Provider store={store}>
          <MemoryRouter>
            <CelularCardConnected
              id={celulares[0].id}
              modelo={celulares[0].modelo}
              marca={celulares[0].marca}
              precio={celulares[0].precio}
            />
          </MemoryRouter>
        </Provider>
      );
      celularCard.find("button").simulate("click");
      expect(deleteCelularspy).toHaveBeenCalled();
      expect(deleteCelularspy).toHaveBeenCalledWith(celulares[0].id);

      const celularCard2 = mount(
        <Provider store={store}>
          <MemoryRouter>
            <CelularCardConnected
              id={celulares[1].id}
              modelo={celulares[1].modelo}
              marca={celulares[1].marca}
              precio={celulares[1].precio}
            />
          </MemoryRouter>
        </Provider>
      );
      celularCard2.find("button").simulate("click");
      expect(deleteCelularspy).toHaveBeenCalled();
      expect(deleteCelularspy).toHaveBeenCalledWith(celulares[1].id);
    });
  });
});
