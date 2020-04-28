import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AfiliadoModel } from '../../models/afiliado.model';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {

  afiliado: AfiliadoModel = new AfiliadoModel();

  constructor() { }

  ngOnInit() {
  }

  onSubmit( form: NgForm ){
    console.log('actualizando datos personales');

  }

}
