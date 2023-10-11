import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro.js';

@Injectable({ providedIn: 'root' })
export class IntroJSService {


    introJS = null;

    tourExplorar() {
        this.introJS = introJs();
        this.introJS.start();

        this.introJS
            .setOptions({
                steps: [
                    {
                        element: '#step1',
                        intro:
                            'Este es nuestro buscador, en él podrás buscar diseños según los filtros que desees.',
                    },
                    {
                      element: '#step2',
                      intro:
                          'Los resultados apareceran aquí.',
                    },
                    {
                      element: '#step3',
                      intro:
                          'Elige el diseño que más te guste.',
                    },
                    {
                      element: '#orden',
                      intro:
                          'Consulta su ficha de información con el botón de la izquierda.\nAñádelo al avatar con el botón del centro.\nGuárdalo en favoritos con el botón de la derecha.',
                    },
                    {
                      element: '#controles',
                      intro:
                          'Una vez seleccionado el diseño que quieres con el boton central, arriba a la izquierda del avatar encontrarás los controles para modificar el avatar a tu gusto.',
                    },
                    {
                      element: '#step5',
                      intro:
                          'Con todo esto ya podrías mover el cursor alrededor del avatar y plasmar el tatuaje donde tú quieras.',
                    }
                ]
            })
            .start();
    }
}
