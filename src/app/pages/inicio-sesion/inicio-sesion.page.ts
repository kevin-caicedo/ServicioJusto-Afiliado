import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AfiliadoModel } from '../../models/afiliado.model';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  afiliado: AfiliadoModel = new AfiliadoModel();
  recordarme = false;

  constructor() { }

  ngOnInit() {
  }

  login( form: NgForm ){
    console.log('logeandome');

  }

  recuperar(){
    console.log('recuperando contraseña');
  }

}
