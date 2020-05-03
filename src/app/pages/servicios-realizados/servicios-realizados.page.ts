import { Component, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/servicio.model';
import { PeticionesService } from '../../services/peticiones.service';
import { PeticionModel } from '../../models/peticiones.model';

@Component({
  selector: 'app-servicios-realizados',
  templateUrl: './servicios-realizados.page.html',
  styleUrls: ['./servicios-realizados.page.scss'],
})
export class ServiciosRealizadosPage implements OnInit {

  servicio: ServicioModel = new ServicioModel();
  servicioArray: ServicioModel[] = [];
  peticionArray: PeticionModel[] = [];

  constructor( private _peticion: PeticionesService ) { }

  ngOnInit() {

    this._peticion.getPeticiones().subscribe( resp=>{
      this.peticionArray = resp;

      for( let item of this.peticionArray ){
        if( this.peticionArray['typeIdAfiliado'] = localStorage.getItem('localId')){
          this._peticion.getServicio( item.idServicio ).subscribe( (resp: ServicioModel)=>{
            
          })
        }
      }

    });


  }

  mefue( servicio: ServicioModel ){

  }

}
