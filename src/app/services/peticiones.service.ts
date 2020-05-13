import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PeticionModel } from '../models/peticiones.model';
import { UsuarioModel } from '../models/usuario.model';
import { ServicioModel } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  private apikey = 'AIzaSyBar45be1zu0zqw5ZlznwH3qS9Dfcc2Cls';
  private urlDatabase = 'https://proyecto-serviciojusto.firebaseio.com';

  constructor( private http: HttpClient ) { }

  
  /**
   * Método que trae los datos de las peticiones
   */
  getPeticiones(){
    return this.http.get(`${ this.urlDatabase }/Peticiones.json`)
      .pipe(
        map( this.crearArregloServicio )
      ); 
  }

  private crearArregloServicio( servicioObj: object){
    
    const servicioArray: PeticionModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: PeticionModel = servicioObj[key];
      servicio.id = key;

      servicioArray.push( servicio );
    });

    return servicioArray;
  }

  /**
   * Método que trae los datos de un solo servicio
   * @author Kevin Caicedo
   * @param id 
   */
  getServicio( id: string ){
    return this.http.get(`${ this.urlDatabase }/Servicio/${ id }.json`);
  }

  getPeticion( id: string ){
    return this.http.get(`${ this.urlDatabase }/Peticiones/${ id }.json`);
  }

  actualizarPeticion( peticion: PeticionModel ){

    const peticionTemp = {
      ...peticion
    }

    delete peticionTemp.id;

    return this.http.put(`${ this.urlDatabase }/Peticiones/${ peticion.id }.json`, peticionTemp);
  }

  getUsuarios(){
    return this.http.get(`${ this.urlDatabase }/Usuario.json`).pipe( map( this.crearArregloUsuario ) );
  }

  private crearArregloUsuario( servicioObj: object){
    
    const servicioArray: UsuarioModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: UsuarioModel = servicioObj[key];
      servicio.id = key;

      servicioArray.push( servicio );
    });

    return servicioArray;
  }

  eliminarPeticion( id: string ){
    return this.http.delete(`${ this.urlDatabase }/Peticiones/${ id }.json`);
  }

  getServicios(){
   
   return this.http.get(`${ this.urlDatabase }/Servicio.json`).pipe(
      map(
        this.crearArregloServicios
      )
    );
  }

  private crearArregloServicios( servicioObj: object){
    
    const servicioArray: ServicioModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: ServicioModel = servicioObj[key];
      servicio.id = key;

      servicioArray.push( servicio );
    });

    return servicioArray;
  }

}
