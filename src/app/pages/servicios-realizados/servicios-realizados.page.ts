import { Component, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/servicio.model';
import { PeticionesService } from '../../services/peticiones.service';
import { PeticionModel } from '../../models/peticiones.model';
import { AlertController } from '@ionic/angular';
import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';
import { PqrsModel } from '../../models/pqrs.model';
import { PqrsService } from '../../services/pqrs.service';

@Component({
  selector: 'app-servicios-realizados',
  templateUrl: './servicios-realizados.page.html',
  styleUrls: ['./servicios-realizados.page.scss'],
})
export class ServiciosRealizadosPage implements OnInit {

  servicio: ServicioModel = new ServicioModel();
  servicioPeticion: ServicioModel = new ServicioModel();
  servicioArray: ServicioModel[] = [];
  peticionArray: PeticionModel[] = [];
  peticionPagarArray: PeticionModel[] = [];
  comisionTotal: number;

  constructor(  private _peticion: PeticionesService,
                public alertController: AlertController,
                private _pqrs: PqrsService ) { }

  ngOnInit() {

    this.comisionTotal = 0;
    this._peticion.getPeticiones().subscribe( resp=>{
      this.peticionArray = resp;
      for( let item of this.peticionArray ){
        if( item.typeIdAfiliado == localStorage.getItem('localId') && item.estado == 'finalizado'){
          this._peticion.getServicio( item.idServicio ).subscribe( (resp: ServicioModel)=>{
            this.servicio = resp;
            this.servicio.id = item.idServicio;
            this.servicio.direccion = item.direccion;
            this.peticionPagarArray.push( item );
            this.servicioPeticion = resp;
            this.servicioPeticion.idPeticion = item.id
            this.servicioArray.push( this.servicioPeticion );
          })
          this.comisionTotal = this.comisionTotal + item.comision;
        }
      }
    });


  }

  pqrsEnvio: PqrsModel = new PqrsModel();

  async mefue( servicio: ServicioModel ) {
    const alert = await this.alertController.create({
      header: 'Escribe tu mensaje!',
      inputs: [
        {
          name: 'mensaje',
          type: 'textarea',
          placeholder: 'Escribe el mensaje para el usuario'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: ( blah ) => {
            this.pqrsEnvio.idPeticion = servicio.idPeticion;
            this.pqrsEnvio.mensaje = blah.mensaje;
            this.pqrsEnvio.quien = 'afiliado';
            this._pqrs.crearPqrs( this.pqrsEnvio ).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Pagando!',
      inputs: [
        {
          name: 'numeroTarjeta',
          type: 'number',
          placeholder: 'Número de Tarjeta',
          min: 0,
          max: 16
        },
        {
          name: 'nombreTitular',
          type: 'textarea',
          placeholder: 'Nombre del titular'
        },
        {
          name: 'fechaVencimiento',
          type: 'text',
          placeholder: 'Fecha vencimiento: mm/yy',
          min: 0,
          max: 6
        },
        {
          name: 'codigoSeguridad',
          type: 'number',
          placeholder: 'Codigo de seguridad',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: ( blah ) => {
            this.pagando(blah);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
  

  pagando( blah: any ){
    console.log(blah);
    for( let item of this.peticionPagarArray ){
      this._peticion.eliminarPeticion( item.id ).subscribe();
      this.comisionTotal = 0;
    }
    this.servicioArray.splice(0, this.servicioArray.length);
  }

}
