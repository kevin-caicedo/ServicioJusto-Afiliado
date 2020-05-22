import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeticionesService } from '../../services/peticiones.service';
import { PeticionModel } from '../../models/peticiones.model';
import { ServicioModel } from '../../models/servicio.model';
import Swal from 'sweetalert2';
import { AfiliadoModel } from '../../models/afiliado.model';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-detalles-servicio',
  templateUrl: './detalles-servicio.page.html',
  styleUrls: ['./detalles-servicio.page.scss'],
})
export class DetallesServicioPage implements OnInit {

  id: string;
  peticion: PeticionModel = new PeticionModel();
  servicio: ServicioModel = new ServicioModel();
  afiliado: AfiliadoModel = new AfiliadoModel();
  usuarioArray: UsuarioModel[] = [];
  usuario: UsuarioModel = new UsuarioModel();
  nuevaDireccion: string;
  codigo: number;
  ubicacionArray: string[] = [];

  constructor(  private activatedRoute: ActivatedRoute,
                private _peticion: PeticionesService,
                private _auth: AuthService,
                private router: Router,
                public alertController: AlertController) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    localStorage.setItem('idPeticion', this.id);

    this._peticion.getPeticion( this.id ).subscribe( (resp: PeticionModel)=>{
      this.peticion = resp;

      if( this.peticion.estado === "solicitado" ){
        if(typeof this.peticion.direccion !== "undefined"){
          this.ubicacionArray = this.peticion.direccion.split(",");  
        }
        this.peticion.id = this.id
        this.peticion.typeIdAfiliado = localStorage.getItem('localId');
        this.peticion.estado = 'aceptado';
        this._peticion.actualizarPeticion( this.peticion ).subscribe();
      }

      this._peticion.getServicio( this.peticion.idServicio ).subscribe( (resp: ServicioModel)=>{
        this.servicio = resp
      });

      this._peticion.getUsuarios().subscribe( (resp)=>{

        this.usuarioArray = resp;
        for( let item of this.usuarioArray ){
          if(item.typeId == this.peticion.typeIdAfiliado){
            this.usuario.celular = item.celular;
          }
        }
      });
    });
  }

  terminarServicio(){
    this._peticion.getPeticion( this.peticion.id ).subscribe(resp=>{

      if( resp['estado'] === "finalizado"){
        localStorage.removeItem('idPeticion');
        location.reload();
      };
      location.reload();
    })
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
    if( this.servicio.precioMinuto <= 1000 ){
      
      this.fechaInicio = new Date(localStorage.getItem('InicioTrabajo'));
      this.fechaFinal = new Date();
      // Total es la suma de horas en minutos, minutos y minuto en segundos
      this.total =  (((this.fechaFinal.getHours() - this.fechaInicio.getHours()) * 60) +
                    (this.fechaFinal.getMinutes() - this.fechaInicio.getMinutes()) +
                    ((this.fechaFinal.getSeconds() - this.fechaInicio.getSeconds())/60))*this.servicio.precioMinuto;

      this.total =  (Math.ceil(this.total / 50))*50;
      
      
      this.peticion.comision = this.total * 0.1;
    }else{

      this.peticion.comision = this.servicio.precioMinuto * 0.1;
      this.total = this.servicio.precioMinuto;
      
    }

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

        this.peticion.id = this.id
        this.peticion.typeIdAfiliado = localStorage.getItem('localId');
        this.peticion.estado = 'finalizado';

        this._peticion.actualizarPeticion( this.peticion ).subscribe();

        this.presentAlertRadio();

        localStorage.removeItem('InicioTrabajo');

        this.router.navigate(['/peticiones'])

        setTimeout(() => location.reload(), 15000)
        
        setTimeout(() => this._peticion.getPeticion( this.peticion.id ).subscribe((resp: PeticionModel)=>{
          this.peticion = resp;

          this._auth.getAfiliado( localStorage.getItem('afiliadoId')).subscribe((resp: AfiliadoModel)=>{
            this.afiliado = resp;

            this.calificando( this.peticion, this.afiliado )
            
          });
        }), 60000);   
        localStorage.removeItem('idPeticion');     
      }
    });

   

  }

  calificacion: number;
  /**
   * Método que va a realizar la calificación del afiliado.
   * @author Kevin Caicedo
   * @param peticionC 
   * @param afiliadoC 
   */
  calificando( peticionC: PeticionModel, afiliadoC: AfiliadoModel ){

    if( peticionC.calificacionAfiliado ){
      
      afiliadoC.id = localStorage.getItem('afiliadoId');

      if( afiliadoC.Calificacion.contador == 0){

        this.calificacion = (peticionC.calificacionAfiliado + afiliadoC.Calificacion.valor) / 2;
  
        afiliadoC.Calificacion = { contador: 2, valor: this.calificacion }

        this._auth.actualizaPerfil( afiliadoC ).subscribe();      
      }else{
  
        this.calificacion = (afiliadoC.Calificacion.valor * afiliadoC.Calificacion.contador + peticionC.calificacionAfiliado)/
                            (afiliadoC.Calificacion.contador + 1)
  
        afiliadoC.Calificacion = { contador: afiliadoC.Calificacion.contador + 1, valor: this.calificacion }
  
        this._auth.actualizaPerfil( afiliadoC ).subscribe();      
      }

    }
  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: `Calificando a usuario `,
      inputs: [
        {
          name: 'Pésimo',
          type: 'radio',
          label: 'Pésimo',
          value: 1          
        },
        {
          name: 'Malo',
          type: 'radio',
          label: 'Malo',
          value: 2
        },
        {
          name: 'Regular',
          type: 'radio',
          label: 'Regular',
          value: 3
        },
        {
          name: 'Bueno',
          type: 'radio',
          label: 'Bueno',
          value: 4
        },
        {
          name: 'Excelente',
          type: 'radio',
          label: 'Excelente',
          value: 5,
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: ( valor ) => {
            this.peticion.calificacionUsuario = valor;
            this._peticion.actualizarPeticion( this.peticion ).subscribe((resp: PeticionModel)=>{

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
                title: 'Tu calificacion ha sido guardada'
              })
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
