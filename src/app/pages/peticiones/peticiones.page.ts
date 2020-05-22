import { Component, OnInit } from '@angular/core';
import { PeticionModel } from '../../models/peticiones.model';
import { PeticionesService } from '../../services/peticiones.service';
import { ServicioModel } from '../../models/servicio.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AfiliadoModel } from '../../models/afiliado.model';

@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.page.html',
  styleUrls: ['./peticiones.page.scss'],
})
export class PeticionesPage implements OnInit {

  peticionesArray: PeticionModel[] = [];
  servicioArray: ServicioModel[] = [];
  servicio: ServicioModel = new ServicioModel();
  afiliado: AfiliadoModel = new AfiliadoModel();
  verifica: boolean;
  idPeticion: boolean; 

  constructor(  private _peticion: PeticionesService,
                private _auth: AuthService,
                private router: Router) { }

  ngOnInit() {

    if( localStorage.getItem('idPeticion') ){
      this.idPeticion = true;
    }
    this._auth.obtenerDatosFirebase().subscribe(resp=>{
      if(resp['users']['0'].emailVerified){
        this.verifica = false;
        this._auth.getAfiliado( localStorage.getItem('afiliadoId')).subscribe( (resp:AfiliadoModel)=>{
          this.afiliado = resp
          
          if( this.afiliado.estado ){
            this._peticion.getPeticiones().subscribe( resp=>{
              this.peticionesArray = resp;
              for( let item of this.peticionesArray ){
                if( item.typeIdAfiliado == 'Buscando' && item.estado == 'solicitado'){
                  this._peticion.getServicio( item.idServicio ).subscribe( (resp:ServicioModel)=>{                  
                    for( let datoAfiliado of this.afiliado.Habilidad ){
                      
                      if( resp['nombreServicio'] == datoAfiliado ){
                        this.servicio = resp;
                        this.servicio.id = item.id;
                        this.servicio.direccion = item.ubicacion;
                        this.servicioArray.push( resp );
                      }
                    }
                  });
                }
              };
            });
          }
        })
      }else{
        this.verifica = true;
        this.afiliado.estado = false;
      }
    });  
  }

  regresar(){
    this.router.navigate(['/detalles-servicio', localStorage.getItem('idPeticion')]);
  }


  borrarElemento( i: number ){
    this.servicioArray.splice(i, 1);
  }

  aceptarServicio( servicio: ServicioModel, i: number ){

    if( !localStorage.getItem('idPeticion') ){

      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea aceptar el servicio?`,
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true
      }).then( resp=>{
        if( resp.value ){
          this._peticion.getPeticion(servicio.id).subscribe( resp=>{
            if(resp){
              this.router.navigate(['/detalles-servicio', servicio.id]);
              this.servicioArray.splice(i, 1);
            }else{
              Swal.fire(
                'Servicio cancelado!',
                'Aceptar!',
                'error'
              );
              this.servicioArray.splice(i, 1);
            }
          })
        }
      });

    }else{
      Swal.fire(
        'Atención!',
        'Ya tienes un servicio en desarrollo!',
        'warning'
      );
    }
  }

  doRefresh(event: any) {
    location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
