/* eslint-disable jest/no-conditional-expect */

import * as data from '../db.json';

import {
   CREATE_CELULAR,
   DELETE_CELULAR,
   GET_ALL_CELULARES,
   GET_CELULARES_DETAIL,
   createCelular,
   deleteCelular,
   getAllCelulares,
   getCelularDetails,
} from '../src/redux/actions';

import axios from 'axios';
import configureStore from 'redux-mock-store';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import thunk from 'redux-thunk';

axios.defaults.adapter = require('axios/lib/adapters/http');

describe('Actions', () => {
   const mockStore = configureStore([thunk]);
   const store = mockStore({ celulares: [] });
   global.fetch = nodeFetch;
   beforeEach(() => {
      store.clearActions();

      // Se mockea las request a las api
      const apiMock = nock('http://localhost:3001').persist();

      // "/celulares" => retorna la propiedad celulares del archivo "data.json".
      apiMock.get('/celulares').reply(200, data.celulares);

      // "/celulares/:id" => retorna un celular matcheado por su "id".
      let id = null;
      apiMock
         .get((uri) => {
            id = Number(uri.split('/').pop()); // Number('undefined') => NaN.
            return !!id;
         })
         .reply(200, (uri, requestBody) => {
            return (
               data.celulares.find((celulares) => celulares.id === id) || {}
            );
         });
   });

   afterEach(() => {
      nock.cleanAll();
   });

   describe('getAllCelulares', () => {
      it("Debe hacer un dispatch con las propiedades 'type: GET_ALL_CELULARES' y, como payload, el resultado de la petición al End-Point provisto", async () => {
         return store
            .dispatch(getAllCelulares())
            .then(() => {
               const actions = store.getActions();
               expect(actions[0].payload.length).toBe(5);
               expect(actions[0]).toEqual({
                  type: GET_ALL_CELULARES,
                  payload: data.celulares,
               });
            })
            .catch((err) => {
               // En caso de que haya un error al mandar la petición al back, el error entrara aquí. Podrás visualizarlo en la consola.
               console.error(err);
               expect(err).toBeUndefined();
            });
      });
   });

   describe('getCelularDetails', () => {
      it("Debe hacer un dispatch con las propiedades 'type: GET_CELULARES_DETAIL' y, como payload, el resultado de la petición al End-Point provisto", async () => {
         const payload = data.celulares[0];
         return store
            .dispatch(getCelularDetails(payload.id))
            .then(() => {
               const actions = store.getActions();
               expect(actions[0]).toStrictEqual({
                  type: GET_CELULARES_DETAIL,
                  payload: { ...payload },
               });
            })
            .catch((err) => {
               // El catch lo utilizamos para "atrapar" cualquier tipo de error a la hora de hacer la petición al Back. Sólo va a entrar si el test no sale como es pedido.
               // Para ver que está pasando debes revisar la consola.
               console.error(err);
               expect(err).toBeUndefined();
            });
      });

      it('Debe traer un celular distinto si el ID requerido es otro (evitar hardcodeos)', async () => {
         const payload = data.celulares[1];
         return store
            .dispatch(getCelularDetails(payload.id))
            .then(() => {
               const actions = store.getActions();
               expect(actions[0]).toStrictEqual({
                  type: GET_CELULARES_DETAIL,
                  payload: { ...payload },
               });
            })
            .catch((err) => {
               // El catch lo utilizamos para "atrapar" cualquier tipo de errores a la hora de hacer la petición al Back. Sólo va a entrar si el test no sale como es pedido.
               // Para ver que está pasando Debes revisar la consola.
               console.error(err);
               expect(err).toBeUndefined();
            });
      });
   });

   describe('createCelular', () => {
      it("Debe retornar una action con las propiedades 'type: CREATE_CELULAR' y, como payload, contener los values recibidos como argumento y un ID incremental", () => {
         // Para que este test pase, deberan declarar una variable ID y que su valor inicialice en 6. Lo hacemos para que no haya conflicto entre los id's mockeados.
         // Si revisas el archivo db.json verán la lista de celulares.
         const payload1 = {
            marca: 'Sony',
            modelo: 'Xperia Pro',
            precio: 2000,
            descripción:
               'este Xperia llega con el Qualcomm Snapdragon 888, una pantalla OLED 4K a 120Hz y 512 GB de memoria interna.',
            sistemaOperativo: 'Android 10',
            imagen:
               'https://moviles.info/wp-content/uploads/2021/01/Sony-Xperia-Pro.png.webp',
            lanzamiento: '26/01/2021',
         };
         const payload2 = {
            marca: 'Motorola',
            modelo: 'Edge S',
            precio: 236,
            descripción:
               'El Motorola Edge S es un dispositivo 5G con el que la marca no parece haber escatimado en componentes. Monta hasta 8 GB de memoria RAM LPDDR5, almacenamiento interno UFS 3.1 (la más rápida actualmente) y una triple cámara trasera con un sensor principal de 64 megapíxeles.',
            sistemaOperativo: 'Android 11',
            imagen: 'https://i.blogs.es/88476e/motorola-edge-s1/450_1000.jpeg',
            lanzamiento: '26/01/2021',
         };

         expect(createCelular(payload1)).toEqual({
            type: CREATE_CELULAR,
            payload: {
               id: 6,
               marca: 'Sony',
               modelo: 'Xperia Pro',
               precio: 2000,
               descripción:
                  'este Xperia llega con el Qualcomm Snapdragon 888, una pantalla OLED 4K a 120Hz y 512 GB de memoria interna.',
               sistemaOperativo: 'Android 10',
               imagen:
                  'https://moviles.info/wp-content/uploads/2021/01/Sony-Xperia-Pro.png.webp',
               lanzamiento: '26/01/2021',
            },
         });

         expect(createCelular(payload2)).toEqual({
            type: 'CREATE_CELULAR',
            payload: {
               id: 7,
               marca: 'Motorola',
               modelo: 'Edge S',
               precio: 236,
               descripción:
                  'El Motorola Edge S es un dispositivo 5G con el que la marca no parece haber escatimado en componentes. Monta hasta 8 GB de memoria RAM LPDDR5, almacenamiento interno UFS 3.1 (la más rápida actualmente) y una triple cámara trasera con un sensor principal de 64 megapíxeles.',
               sistemaOperativo: 'Android 11',
               imagen:
                  'https://i.blogs.es/88476e/motorola-edge-s1/450_1000.jpeg',
               lanzamiento: '26/01/2021',
            },
         });
      });
   });

   describe('deleteCelular', () => {
      it("Debe retornar una action con las propiedades 'type: DELETE_CELULAR, y como payload, el ID del celular a eliminar. Recibe el ID por argumento", () => {
         expect(deleteCelular(1)).toEqual({
            type: DELETE_CELULAR,
            payload: 1,
         });
         expect(deleteCelular(2)).toEqual({
            type: DELETE_CELULAR,
            payload: 2,
         });
      });
   });
});
