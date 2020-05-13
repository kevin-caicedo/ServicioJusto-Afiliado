import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AfiliadoModel } from '../models/afiliado.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apikey = 'AIzaSyBar45be1zu0zqw5ZlznwH3qS9Dfcc2Cls';
  private urlDatabase = 'https://proyecto-serviciojusto.firebaseio.com';
  
  adminToken: string;
  afiliadoArray: AfiliadoModel[] = [];
  afiliado: AfiliadoModel

  constructor( private http: HttpClient ) { 
    this.leerToken();
  }

  /**
   * Método para cerrar sesión
   */
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
    localStorage.removeItem('localId');
    localStorage.removeItem('afiliadoId');
  }


  /**
   * 
   * Método para agregar nuevo afiliado, solo parte de autenticación
   * @author Kevin Caicedo
   * @param afiliado 
   */
  nuevoAfiliado( afiliado: AfiliadoModel ){

    const authData = {
      email: afiliado.email,
      password: afiliado.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }:signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp=> {
          this.guardarToken(resp['idToken']);
          localStorage.setItem('localId', resp['localId']);
          return resp;
        })
      );
  }

  /**
   * Método para agregar los demas datos en la base de datos en tiempo real
   * @author Kevin Caicedo
   * @param afiliado 
   */
  nuevoAfiliadoResto( afiliado: AfiliadoModel ){

    const afiliadoTemp = {
      ...afiliado
    };

    delete afiliadoTemp.id;
    delete afiliadoTemp.email;
    delete afiliadoTemp.password;

    return this.http.post(`${ this.urlDatabase }/Afiliado.json`, afiliadoTemp)
    .pipe(
      map( (resp:any)=>{
        afiliado.id = resp.name;
        localStorage.setItem('afiliadoId', afiliado.id);
        return afiliado;
      })
    );
  }
  /**
   * Método que hace que permite logearse al afiliado
   * @author Kevin Caicedo
   * @param afiliado 
   */
  login( afiliado: AfiliadoModel ){
    const authData = {
      email: afiliado.email,
      password: afiliado.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }:signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp=> {
          this.guardarToken(resp['idToken']);
          localStorage.setItem('localId', resp['localId']);
          return resp;
        })
      
      );  
  }

  /**
   * Método para guardar el token del afiliado
   * @author Kevin Caicedo
   * @param idToken 
   */
  private guardarToken(idToken: string){
    this.adminToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  /**
   * Método que lee si hay datos en el localStorage
   * @author Kevin Caicedo
   */
  leerToken(){
    if( localStorage.getItem('token')){
      this.adminToken = localStorage.getItem('token');
    }else{
      this.adminToken = '';
    }
    return this.adminToken;
  }

  /**
   * Método que permite asegurar las páginas con los guards e impedir entrar a paginas si no está logeado
   */
  estaAutenticado(): boolean{
    
    if(this.adminToken.length < 2){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira)

    if(expiraDate > new Date()){
      return true;
    }else{
      return false
    }
    
  }

  /**
   * Método que permite obtener todos los afiliado
   * @author Kevin Caicedo
   */
  getTodosAfiliados(){

    return this.http.get(`${ this.urlDatabase }/Afiliado.json`)
      .pipe(
        map( this.crearArregloServicio )
      );

  }

  /**
   * Método que trae los datos de firebase y lo convierte en array
   * @author Kevin Caicedo
   * @param servicioObj 
   */
  private crearArregloServicio( servicioObj: object){
    
    const usuarioArray: AfiliadoModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: AfiliadoModel = servicioObj[key];
      servicio.id = key;

      usuarioArray.push( servicio );
    });

    return usuarioArray;
  }

  /**
   * Obtiene solo un afiliado por comparando id de autenticación y id de afiliado de relacion
   * y guardar el id en el localStorage
   */
  getUnAfiliado(){

    this.getTodosAfiliados().subscribe(resp=>{
      this.afiliadoArray = resp;
      
      for( let item of this.afiliadoArray ){
        if( localStorage.getItem('localId') == item.typeIdAfiliado ){
          localStorage.setItem('afiliadoId', item.id);
          break;
        }
      }
    });
  }

  /**
   * Método que permite obtener el afiliado por el id
   * @author Kevin Caicedo
   * @param id 
   */
  getAfiliado( id: string ){    
    return this.http.get(`${ this.urlDatabase }/Afiliado/${ id }.json`);
  }


  /**
   * Método que permite actualizar perfil
   * @author Kevin Caicedo
   * @param afiliado 
   */
  actualizaPerfil( afiliado: AfiliadoModel ){

    const afiliadoTemp = {
      ...afiliado
    }

    delete afiliadoTemp.id;
    delete afiliadoTemp.password;

    return this.http.put(`${ this.urlDatabase }/Afiliado/${ afiliado.id }.json`, afiliadoTemp);

  }

  /**
   * Método para eliminar cuenta de correo para
   * cerrar cuenta
   */
  eliminarCuentaCorreo(){

    const authData = {
      idToken: localStorage.getItem('token')
    };
    return this.http.post(`${ this.url }:delete?key=${ this.apikey }`, authData);
  }

  /**
   * Método para eliminar los datos para
   * cerrar cuenta
   */
  eliminarCuentaDatos(){
    return this.http.delete(`${ this.urlDatabase }/Afiliado/${ localStorage.getItem('afiliadoId') }.json`);
  }

  recuperarContrasena( correo: string ){

    const recupera = {
      requestType: 'PASSWORD_RESET',
      email: correo
    }

    return this.http.post(`${ this.url }:sendOobCode?key=${ this.apikey }`, recupera);
  }

  cambiaContrasena( afiliado: AfiliadoModel ){

    const usuarioTemp = {
      idToken: localStorage.getItem('token'),
      password: afiliado.password,
      returnSecureToken: false
    }

    return this.http.post(`${ this.url }:update?key=${ this.apikey }`, usuarioTemp);
  }  
}
