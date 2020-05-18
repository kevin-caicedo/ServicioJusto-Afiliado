import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AfiliadoModel } from '../../models/afiliado.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PeticionesService } from '../../services/peticiones.service';
import { ServicioModel } from '../../models/servicio.model';

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
  servicios: ServicioModel[] = [];

  constructor(  private registro: AuthService,
                private router: Router,
                private _peticion: PeticionesService ) {
    this.afiliado = new AfiliadoModel();
  }

  ngOnInit() {

    this._peticion.getServicios().subscribe(resp=>{
      this.servicios = resp;
    });
  }

  onSubmit( form: NgForm ){

    if( form.invalid ){
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.afiliado.estado = false;
    this.afiliado.Calificacion = {valor: 5, contador: 0};

    this.registro.nuevoAfiliado( this.afiliado ).subscribe( resp =>{
      this.afiliado.typeIdAfiliado = resp['localId'];
      this.registro.nuevoAfiliadoResto( this.afiliado ).subscribe( resp =>{
        this.afiliado.id = resp['id'];
      }, err=>{
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      })
      Swal.close();
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
    });



  }

}
