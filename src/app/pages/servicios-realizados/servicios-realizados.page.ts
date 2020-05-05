import { Component, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/servicio.model';
import { PeticionesService } from '../../services/peticiones.service';
import { PeticionModel } from '../../models/peticiones.model';
import { AlertController } from '@ionic/angular';
import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app-servicios-realizados',
  templateUrl: './servicios-realizados.page.html',
  styleUrls: ['./servicios-realizados.page.scss'],
})
export class ServiciosRealizadosPage implements OnInit {

  servicio: ServicioModel = new ServicioModel();
  servicioArray: ServicioModel[] = [];
  peticionArray: PeticionModel[] = [];
  peticionPagarArray: PeticionModel[] = [];
  comisionTotal: number;

  constructor(  private _peticion: PeticionesService,
                public alertController: AlertController ) { }

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
            this.servicioArray.push( resp );
          })
          this.comisionTotal = this.comisionTotal + item.comision;
        }
      }
    });


  }

  mefue( servicio: ServicioModel, peticion: ServicioModel ){
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Placeholder 1'
        },
        {
          name: 'name2',
          type: 'text',
          id: 'name2-id',
          value: 'hello',
          placeholder: 'Placeholder 2'
        },
        // multiline input.
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Placeholder 3'
        },
        {
          name: 'name3',
          value: 'http://ionicframework.com',
          type: 'url',
          placeholder: 'Favorite site ever'
        },
        // input date with min & max
        {
          name: 'name4',
          type: 'date',
          min: '2017-03-01',
          max: '2018-01-12'
        },
        // input date without min nor max
        {
          name: 'name5',
          type: 'date'
        },
        {
          name: 'name6',
          type: 'number',
          min: -5,
          max: 10
        },
        {
          name: 'name7',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
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
    for( let item of this.peticionPagarArray ){
      console.log(item.id);

      this._peticion.eliminarPeticion( item.id ).subscribe();
      this.comisionTotal = 0;
    }
    this.servicioArray.splice(0, this.servicioArray.length);
    //this.peticionPagarArray.splice(0, this.peticionPagarArray.length);
    
  }

}
