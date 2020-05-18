import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AfiliadoModel } from '../../models/afiliado.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  afiliado: AfiliadoModel = new AfiliadoModel();
  recordarme = false;

  constructor( private auth: AuthService,
                private router: Router ) { }

  ngOnInit() {
    if(localStorage.getItem('email')){
      this.afiliado.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }

  login( form: NgForm ){

    if(form.invalid){ return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login( this.afiliado ).subscribe( resp=>{
      Swal.close();
        if( this.recordarme ){
          localStorage.setItem('email', this.afiliado.email);
        }else{
          localStorage.removeItem('email');
        }

        this.auth.getUnAfiliado();
        this.router.navigateByUrl('/peticiones');
        setTimeout(() => location.reload(), 4000);

        Swal.fire(
          'Bienvenido!',
          'Ok para continuar!',
          'success'
        );

        
    }, (err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: err.error.error.message
      });
    })
  }

  recuperar(){

    if( !this.afiliado.email ){
      Swal.fire({
        icon: 'warning',
        title: 'Email',
        text: 'Tienes que diligenciar el campo CORREO electrónico para recuperar contraseña',
      });
      return;
    }

    this.auth.recuperarContrasena( this.afiliado.email ).subscribe( resp=>{
      Swal.fire({
        icon: 'success',
        title: 'Recupera tu contraseña',
        text: 'Ya te llegó el correo para restablecer contraseña, ¡¡revísalo!!',
      })
    }, (err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'CORREO NO ENCONTRADO'
      });
    })


  }
  

}
