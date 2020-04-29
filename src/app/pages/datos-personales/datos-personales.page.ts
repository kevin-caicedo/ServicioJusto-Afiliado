import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AfiliadoModel } from '../../models/afiliado.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {

  afiliado: AfiliadoModel = new AfiliadoModel();

  constructor( private auth: AuthService ) { }

  ngOnInit() {

    if( localStorage.getItem('afiliadoId')){
      this.auth.getAfiliado( localStorage.getItem('afiliadoId')).subscribe( (resp: AfiliadoModel)=>{
        this.afiliado = resp
      });
    }


  }

  onSubmit( form: NgForm ){

    if( form.invalid ){ return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.afiliado.id = localStorage.getItem('afiliadoId');
    
    this.auth.actualizaPerfil( this.afiliado ).subscribe( resp=>{
      Swal.close();
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: `${ this.afiliado.Nombre } se actualizó correctamente`
      })
    } );
  }

}
