import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cerrar-cuenta',
  templateUrl: './cerrar-cuenta.page.html',
  styleUrls: ['./cerrar-cuenta.page.scss'],
})
export class CerrarCuentaPage implements OnInit {

  constructor( private auth: AuthService,
                private router: Router ) { }

  ngOnInit() {
  }

  cerrarCuenta(){

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar tu cuenta`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp=>{

      if( resp.value ){

        if(!localStorage.getItem('idPeticion')){

          this.auth.eliminarCuentaCorreo( ).subscribe( );
          this.auth.eliminarCuentaDatos( ).subscribe();
          this.router.navigate(['registro']);
  
          setTimeout(() => {
            this.auth.logout();
            location.reload();
          }, 1500)
          
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
          });
          
          Toast.fire({
            icon: 'success',
            title: `se eliminó correctamente`
          });
  

        }else{
          Swal.fire(
            'Atención!',
            'No puede eliminar su cuenta, servicio en desarrollo!',
            'warning'
          )
        }
      }
    });
    
  }

}
