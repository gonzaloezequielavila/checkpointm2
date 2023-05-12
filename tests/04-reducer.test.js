import * as data from '../db.json';

import {
   GET_ALL_CELULARES,
   GET_CELULARES_DETAIL,
   createCelular,
   deleteCelular,
} from '../src/redux/actions';

import rootReducer from '../src/redux/reducer';

// Acá se mockean las actions para que el test pueda funcionar correctamente, sin importar si hay un bug en ese archivo.
jest.mock('../src/redux/actions', () => ({
   __esmodules: true,
   GET_ALL_CELULARES: 'GET_ALL_CELULARES',
   DELETE_CELULAR: 'DELETE_CELULAR',
   GET_CELULARES_DETAIL: 'GET_CELULARES_DETAIL',
   CREATE_CELULAR: 'CREATE_CELULAR',
   createCelular: (payload) => ({
      type: 'CREATE_CELULAR',
      payload,
   }),
   deleteCelular: (payload) => ({
      type: 'DELETE_CELULAR',
      payload,
   }),
   getCelularDetails: (payload) => ({
      type: 'GET_CELULARES_DETAIL',
      payload,
   }),
}));

describe('Reducer', () => {
   const state = {
      celulares: [],
      celularDetail: {},
   };

   it('Si no hay un action-type válido, debe retornar el estado inicial', () => {
      expect(rootReducer(undefined, [])).toEqual({
         celulares: [],
         celularDetail: {},
      });
   });

   it('Cuando la action-type es "GET_ALL_CELULARES" debe guardar, en estado "celulares", los celulares obtenidos en nuestro llamado al Back-End', () => {
      const result = rootReducer(state, {
         type: GET_ALL_CELULARES,
         payload: data.celulares,
      });
      // Acuerdense que el state inicial no tiene que mutar!
      expect(result).not.toEqual(state);
      expect(result).toEqual({
         celulares: data.celulares, // Cuando ejecutes los tests, vas a ver bien lo que espera que le llegue a nuestro estado!
         celularDetail: {},
      });
   });

   it('Cuando la action-type es "GET_CELULARES_DETAIL" debe guardar, en el estado "celularDetail", el celular obtenido en nuestro llamado al Back-End', () => {
      const result = rootReducer(state, {
         type: GET_CELULARES_DETAIL,
         payload: data.celulares[0],
      });
      // Acuerdense que el state inicial no tiene que mutar!
      expect(result).not.toEqual(state);
      expect(result).toEqual({
         celulares: [],
         celularDetail: data.celulares[0],
      });
   });

   it('Cuando la action-type es "CREATE_CELULAR" debe agregar un nuevo celular al estado "celulares"', () => {
      const state = {
         celulares: data.celulares,
         celularDetail: {},
      };

      const payload1 = {
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
      };

      const payload2 = {
         id: 7,
         marca: 'Motorola',
         modelo: 'Edge S',
         precio: 236,
         descripción:
            'El Motorola Edge S es un dispositivo 5G con el que la marca no parece haber escatimado en componentes. Monta hasta 8 GB de memoria RAM LPDDR5, almacenamiento interno UFS 3.1 (la más rápida actualmente) y una triple cámara trasera con un sensor principal de 64 megapíxeles.',
         sistemaOperativo: 'Android 11',
         imagen: 'https://i.blogs.es/88476e/motorola-edge-s1/450_1000.jpeg',
         lanzamiento: '26/01/2021',
      };

      const allcelularesType1 = [
         ...data.celulares,
         {
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
      ];
      const allcelularesType2 = [
         ...allcelularesType1,
         {
            id: 7,
            marca: 'Motorola',
            modelo: 'Edge S',
            precio: 236,
            descripción:
               'El Motorola Edge S es un dispositivo 5G con el que la marca no parece haber escatimado en componentes. Monta hasta 8 GB de memoria RAM LPDDR5, almacenamiento interno UFS 3.1 (la más rápida actualmente) y una triple cámara trasera con un sensor principal de 64 megapíxeles.',
            sistemaOperativo: 'Android 11',
            imagen: 'https://i.blogs.es/88476e/motorola-edge-s1/450_1000.jpeg',
            lanzamiento: '26/01/2021',
         },
      ];
      const primerCelular = rootReducer(state, createCelular(payload1));
      const segundoCelular = rootReducer(
         { ...state, celulares: allcelularesType1 },
         createCelular(payload2)
      );

      // Acuerdense que el state inicial no tiene que mutar!
      expect(primerCelular).not.toEqual(state);
      expect(segundoCelular).not.toEqual(state);

      expect(primerCelular).toEqual({
         celularDetail: {},
         celulares: allcelularesType1,
      });
      expect(segundoCelular).toEqual({
         celularDetail: {},
         celulares: allcelularesType2,
      });
   });

   it('Cuando la action-type es "DELETE_CELULAR" debe eliminar el celular que posee el ID recibido del estado "celulares"', () => {
      // Caso 1
      const payload = 1;
      const state = {
         celulares: [
            {
               id: 1,
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
         ],
         celularDetail: {},
      };

      expect(rootReducer(state, deleteCelular(payload))).toEqual({
         celulares: [],
         celularDetail: {},
      });

      //Caso 2
      const payload2 = 6;
      const state2 = {
         celulares: [
            {
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
            {
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
         ],
         celularDetail: {},
      };

      expect(rootReducer(state2, deleteCelular(payload2))).toEqual({
         celulares: [
            {
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
         ],
         celularDetail: {},
      });
   });
});
