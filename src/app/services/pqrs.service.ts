import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PqrsModel } from '../models/pqrs.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {

  private apikey = 'AIzaSyBar45be1zu0zqw5ZlznwH3qS9Dfcc2Cls';
  private urlDatabase = 'https://proyecto-serviciojusto.firebaseio.com';
  
  constructor( private http: HttpClient ) { }

  /**
   * Método para crear PQRS
   * @author Kevin Caicedo
   * @param pqrs 
   */
  crearPqrs( pqrs: PqrsModel ){

    return this.http.post(`${ this.urlDatabase }/Pqrs.json`, pqrs)
      .pipe(
        map((resp:any)=>{
          pqrs.id = resp.name;
          return pqrs;
        })
      );
  }
}
