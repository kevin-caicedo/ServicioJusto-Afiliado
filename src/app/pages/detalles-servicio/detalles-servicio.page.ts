import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalles-servicio',
  templateUrl: './detalles-servicio.page.html',
  styleUrls: ['./detalles-servicio.page.scss'],
})
export class DetallesServicioPage implements OnInit {

  codigo: string;
  constructor() { }

  ngOnInit() {
  }

  codigoExiste(){
    console.log('Comprueba que el código existe ' + this.codigo);
  }

  finalizarServicio(){
    console.log('Finalizando servicio');
  }

}
