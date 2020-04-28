import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AfiliadoModel } from '../../models/afiliado.model';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  customPopoverOptions: any = {
    header: 'Servicio',
    subHeader: 'Selecciona tu habilidad'
  };

  afiliado: AfiliadoModel;
  constructor() {
    this.afiliado = new AfiliadoModel();
  }

  ngOnInit() {
  }

  onSubmit( form: NgForm ){

    console.log(this.afiliado.Habilidad);

    console.log(form);

  }

}
