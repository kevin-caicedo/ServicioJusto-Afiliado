import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeticionesService } from '../../services/peticiones.service';
import { PeticionModel } from '../../models/peticiones.model';
import { ServicioModel } from '../../models/servicio.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-servicio',
  templateUrl: './detalles-servicio.page.html',
  styleUrls: ['./detalles-servicio.page.scss'],
})
export class DetallesServicioPage implements OnInit {

  id: string;
  peticion: PeticionModel = new PeticionModel();
  servicio: ServicioModel = new ServicioModel();
  codigo: number;

  constructor(  private activatedRoute: ActivatedRoute,
                private _peticion: PeticionesService,
                private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this._peticion.getPeticion( this.id ).subscribe( (resp: PeticionModel)=>{
      this.peticion = resp;
      this.peticion.id = this.id
      this.peticion.typeIdAfiliado = localStorage.getItem('localId');
      this.peticion.estado = 'aceptado';
      
      this._peticion.actualizarPeticion( this.peticion ).subscribe();

      this._peticion.getServicio( this.peticion.idServicio ).subscribe( (resp: ServicioModel)=>{
        this.servicio = resp
      });
    });
  }

  codigoExiste(){

    if( this.codigo == this.peticion.codigo){

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      this.peticion.id = this.id
      this.peticion.typeIdAfiliado = localStorage.getItem('localId');
      this.peticion.estado = 'ejecucion';
      
      this._peticion.actualizarPeticion( this.peticion ).subscribe( resp=>{
        Swal.close();

        localStorage.setItem('InicioTrabajo', Date());

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
          title: 'Puede comenzar su trabajo, DALE PRONTO!!'
        })
      }, err=>{
        Swal.fire({
          icon: 'error',
          title: 'Error, inténtalo de nuevo',
          text: err.error.error.message
        });
      } );

    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Código incorrecto',
      })
    }
  }

  fechaInicio: Date;
  fechaFinal: Date;
  total: number;

  /**
   * Método para finalizar el servicio
   */
  finalizarServicio(){
    this.peticion.id = this.id
    this.peticion.typeIdAfiliado = localStorage.getItem('localId');
    this.peticion.estado = 'finalizado';
      
    this._peticion.actualizarPeticion( this.peticion ).subscribe( resp=>{

      this.fechaInicio = new Date(localStorage.getItem('InicioTrabajo'));
      this.fechaFinal = new Date();

      // Total es la suma de horas en minutos, minutos y minuto en segundos
      this.total =  (((this.fechaFinal.getHours() - this.fechaInicio.getHours()) * 60) +
                    (this.fechaFinal.getMinutes() - this.fechaInicio.getMinutes()) +
                    ((this.fechaFinal.getSeconds() - this.fechaInicio.getSeconds())/60))*this.servicio.precioMinuto;

      Swal.fire({
        title: 'Finalizar Servicio',
        text: `COBRAR: $${ this.total } Pesos`,
        icon: "info",
        showConfirmButton: true,
        showCancelButton: true
      }).then( resp=>{
        if( resp.value ){
          Swal.fire({
            icon: 'success',
            title: 'Muchas gracias por su LABOR',
            text: `Gracias!!`
          });
          this.router.navigate(['/peticiones']);
        }
      });
    });
  }

}
