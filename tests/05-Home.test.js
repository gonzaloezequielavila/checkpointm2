import * as actions from '../src/redux/actions';
import * as data from '../db.json';

import HomeConnected, {
   Home,
   mapDispatchToProps,
   mapStateToProps,
} from '../src/components/Home/Home';
import { configure, mount, shallow } from 'enzyme';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CelularCard from '../src/components/CelularCard/CelularCard';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import isReact from 'is-react';
import mainImage from '../src/img-cp2/main-image-cp2.jpg';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import thunk from 'redux-thunk';

axios.defaults.adapter = require('axios/lib/adapters/http');

configure({ adapter: new Adapter() });

// Acá se mockea la action para que el test pueda funcionar correctamente, sin importar si hay un bug en ese archivo.
jest.mock('../src/redux/actions/index.js', () => ({
   getAllCelulares: () => ({
      type: 'GET_ALL_CELULARES',
   }),
}));

jest.mock('../src/components/CelularCard/CelularCard', () => () => <></>);

describe('<Home />', () => {
   let home, store, state, getAllCelularesSpy, componentDidMountSpy;
   global.fetch = nodeFetch;
   const mockStore = configureStore([thunk]);
   beforeEach(() => {
      // Se Mockea las request a las api
      const apiMock = nock('http://localhost:3001').persist();

      // "/celulares" => Retorna la propiedad celulares del archivo data.json
      apiMock.get('/celulares').reply(200, data.celulares);

      // "/celulares/:id" => Retorna un celular matcheado por su id
      // "/celulares/:id" => Retorna un celular matcheado por su id
      let id = null;
      apiMock
         .get((uri) => {
            id = Number(uri.split('/').pop()); // Number('undefined') => NaN
            return !!id;
         })
         .reply(200, (uri, requestBody) => {
            return data.celulares.find((celular) => celular.id === id) || {};
         });
      state = {
         celulares: [],
         celularDetail: {},
      };
      store = mockStore(state);
      home = mount(<HomeConnected store={store} />);
      // ¡Si o si vas a tener que usar class component! No van a pasar ninguno de los tests si no lo haces.
      expect(isReact.classComponent(Home)).toBeTruthy();

      store.clearActions();
   });

   afterEach(() => {
      nock.cleanAll();
   });

   it('Debe rederizar un "h1" con el texto "Cellphones"', () => {
      expect(home.find('h1').at(0).text()).toEqual('Cellphones');
   });

   it('Debe renderizar un tag "img" con la imagen provista en la carpeta "img-cp2"', () => {
      // Tendrías que importar la img a tu archivo "Home.jsx" y luego usarla como source de img.
      // Podés ver como lo hacemos en este mismo archivo en la linea 16!
      expect(home.find('img').at(0).prop('src')).toEqual(mainImage);
   });

   it('La imagen debe tener un atributo "alt" con el texto "celular-logo"', () => {
      expect(home.find('img').at(0).prop('alt')).toEqual('celular-logo');
   });

   it('Debe rederizar un "h3" con el texto "Celulares:"', () => {
      expect(home.find('h3').at(0).text()).toEqual('Celulares:');
   });

   it('Debe rederizar un "h4" con el texto "Checkpoint M2"', () => {
      expect(home.find('h4').at(0).text()).toEqual('Checkpoint M2');
   });

   describe('connect Redux', () => {
      // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS TE DEJAMOS COMENTARIOS PARA CADA USO LEER BIEN!!🚨
      it('Debe traer del estado global de Redux todos los celulares utilizando mapStateToProps', () => {
         // El estado Debe tener un nombre "celulares".
         expect(mapStateToProps(state)).toEqual({
            celulares: state.celulares,
         });
      });

      if (typeof mapDispatchToProps === 'function') {
         // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UNA FUNCIÓN.
         // IMPORTANTE! SI LO HACES DE ESTA FORMA LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA
         // import * as actions from "./../../redux/actions/index";
         it("Debe traer por props la action-creator 'getAllCelulares' de Redux utilizando mapDispatchToProps", () => {
            // Acá testeamos que hagas todo el proceso. Utilizas la funcion "mapDispatchToProps",
            // y con ella despachas la accion "getAllCelulares".
            const getAllCelulares = jest.spyOn(actions, 'getAllCelulares');
            const dispatch = jest.fn();
            const props = mapDispatchToProps(dispatch);
            props.getAllCelulares();
            expect(dispatch).toHaveBeenCalled();
            expect(getAllCelulares).toHaveBeenCalled();
         });
      } else {
         // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UN OBJETO.
         // ¡IMPORTANTE! SI LO HACES DE ESTA FORMA mapDispatchToProps TIENE QUE SER EL OBJETO.
         // eslint-disable-next-line jest/no-identical-title
         it("Debe traer por props la action-creator 'getAllCelulares' de Redux utilizando mapDispatchToProps", () => {
            // Acá testeamos que hagas todo el proceso. Utilizas connect y el objeto "mapDispatchToProps",
            // traes la acción "getAllCelulares". Con esto podrás usarla luego en el componente.
            const getAllCelulares = jest.spyOn(actions, 'getAllCelulares');
            getAllCelulares();
            expect(
               mapDispatchToProps.hasOwnProperty('getAllCelulares')
            ).toBeTruthy();
            expect(getAllCelulares).toHaveBeenCalled();
         });
      }
   });

   describe('React LifeCycles', () => {
      getAllCelularesSpy = jest.fn();
      let instance;
      beforeEach(async () => {
         state = {
            celulares: data.celulares,
            celularDetail: {},
         };
         store = mockStore(state);
         home = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/home']}>
                  <HomeConnected />
               </MemoryRouter>
            </Provider>
         );
      });

      beforeAll(() => {
         // Ojo acá. Antes que corran los demás tests, chequeamos que estés utilizando el lifeCycle correspondiente ( componentDidMount )
         // y que en él ejecutas la action creator "getAllCelulares" para traerte toda esa data.
         // Si no pasan estos tests, no pasan los demás!
         componentDidMountSpy = jest.spyOn(Home.prototype, 'componentDidMount');
         instance = shallow(
            <Home getAllCelulares={getAllCelularesSpy} />
         ).instance();

         instance.componentDidMount();
         expect(componentDidMountSpy).toHaveBeenCalled();
         expect(getAllCelularesSpy).toHaveBeenCalled();
      });

      it('Debe mapear todos los celulares que hay en el estado global, y renderizar una <CelularCard /> por cada una', () => {
         // Cuidado acá. Como realizamos una petición al back (código asincrónico), el componente se va a
         // renderizar más rápido. Hay un problema con esto, se va a intentar renderizar algunos datos que
         // no existen todavía, lo que es igual a un fatal error. Debes asegurarte que existen
         // jugadores y luego renderizarlos!
         // Pista: Usa un renderizado condicional.
         // IMPORTANTE: revisar el código arriba de este test, el beforeAll.
         // Ahí se está testeando el uso del lifecycle componentDidMount y que en él
         // traigas la data a renderizar.
         expect(home.find(CelularCard)).toHaveLength(5);
      });

      it('Debe pasar a cada componente <CelularCard /> las propiedades: "id", "marca", "precio", "imagen" y "modelo" de cada celular', () => {
         // No olviden pasar la props KEY en el mappeo para mantener buenas prácticas.
         expect(home.find(CelularCard).at(0).props().id).toEqual(1);
         expect(home.find(CelularCard).at(0).props().marca).toEqual('Sony');
         expect(home.find(CelularCard).at(0).props().imagen).toEqual(
            'https://moviles.info/wp-content/uploads/2021/01/Sony-Xperia-Pro.png.webp'
         );
         expect(home.find(CelularCard).at(0).props().precio).toEqual(2000);
         expect(home.find(CelularCard).at(0).props().modelo).toEqual(
            'Xperia Pro'
         );
      });
   });
});
