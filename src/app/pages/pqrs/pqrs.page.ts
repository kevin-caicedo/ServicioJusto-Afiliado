import { Component, OnInit } from '@angular/core';
import { PqrsModel } from '../../models/pqrs.model';
import { NgForm } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.page.html',
  styleUrls: ['./pqrs.page.scss'],
})
export class PqrsPage implements OnInit {

  pqrs: PqrsModel;

  constructor( private _pqrs: PqrsService, private _auth: AuthService ) {
    this.pqrs = new PqrsModel();
  }

  ngOnInit() {
    if( localStorage.getItem('afiliadoId')){
      this._auth.getAfiliado( localStorage.getItem('afiliadoId')).subscribe( (resp: PqrsModel)=>{
        this.pqrs.nombre = resp['Nombre'];
        this.pqrs.apellido = resp['Apellido'];
      });
    }
  }

  nuevoPqrs( form: NgForm ){

    if( form.invalid ){ return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this._pqrs.crearPqrs( this.pqrs ).subscribe(resp=>{

      Swal.close();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: `${this.pqrs.tipo} enviada!!`
        })

        this.pqrs.tipo = "";
        this.pqrs.mensaje = "";
    }, err=>{
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: err.error.error.message
      });
    });
  }

}
