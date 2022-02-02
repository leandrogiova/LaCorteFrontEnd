import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mesaProductos } from 'src/app/models/mesaProductos';


@Injectable({
  providedIn: 'root'
})
export class MesaProductoService {

  constructor(private http: HttpClient) {

  }

  public getMesasAbiertas(): Observable<mesaProductos[]>{
    return this.http.get<mesaProductos[]>('http://localhost:8080/mesasAbiertas/lista');
  }


  public postAbrirMesa(m1: mesaProductos): void{
    this.http.post('http://localhost:8080/mesasAbiertas/envio', m1).subscribe();
  }

  public postActualizar(m1: mesaProductos): void{
    this.http.post('http://localhost:8080/mesasAbiertas/updateMesa', m1).subscribe();
  }

  public postCerrarMesa(m1: mesaProductos): void{
    this.http.post('http://localhost:8080/mesasAbiertas/cobrarMesa', m1).subscribe();
  }




  public postResumenes(fechas: Date[]): void{
    this.http.post('http://localhost:8080/mesasAbiertas/FechasResumenes', fechas).subscribe();
  }

  public getResumenes(): Observable<mesaProductos[]>{
    return this.http.get<mesaProductos[]>('http://localhost:8080/mesasAbiertas/Resumenes');
  }

}
