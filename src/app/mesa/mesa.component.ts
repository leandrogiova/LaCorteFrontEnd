import { ConditionalExpr, ThrowStmt } from '@angular/compiler';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { MesaProductoService } from '../mesa-producto.service';
import { mesaProductos } from '../models/mesaProductos';
import { Producto } from '../models/producto';
import { ProductoService } from '../producto.service';
import { numeroDeMesaValidator } from './numeroMesaValidador';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})
export class MesaComponent implements OnInit {

  productos: Producto[];
  mesas: mesaProductos[];
  mesaUnica: mesaProductos;

  verLista: boolean;
  verForm: boolean;
  verMesaCobrar: boolean;
  verOcultar: string;
  lista: Producto[];
  lista2: Producto[];


  abrirMesaForm: FormGroup;
  numeroMesa: FormControl;
  numeroDeProducto: FormControl;



  constructor(private servicioProducto: ProductoService,private mesaProductoService: MesaProductoService ,private fb: FormBuilder ) { 
    this.productos = [];
    this.mesas = [];
    this.mesaUnica = new mesaProductos();
    
    this.verLista = false;
    this.verForm = false;
    this.verOcultar = "Ver";
    this.lista = [];
    this.lista2 = [];

    this.numeroDeProducto = new FormControl('', [Validators.required]);
    this.numeroMesa = new FormControl('', [Validators.required]);


  }




  ngOnInit(): void {   
    this.servicioProducto.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });
    this.mesaProductoService.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });
  }


  /*
    * FUNCION verMesasAbiertas actualiza la lista "this.mesas" para evitar errores
  */
  verMesasAbiertas(){
    this.mesaProductoService.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });
  }


  /*
    * Oculta o muestra la lista de las mesas
  */
  VerOcutalLista(): void{
    if(this.verLista){
      this.verLista = false;
      this.verOcultar = "Ver"
    }
    else{
      this.verLista = true;
      this.verOcultar = "Ocultar"
    }
  }



  /*
    * FUNCION VerOcultarFormulario
    * Muestra el formulario de para agregar una nueva mesa
    * Actualiza la lista de las mesas (variable this.mesas) y inicializa el formulario abrirMesaForms
    * 
  */
  VerOcutarFormulario(){
    this.verForm = !this.verForm;
    
    this.mesaProductoService.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });

    this.abrirMesaForm =  this.fb.group({
      numeroMesa: new FormControl('', [Validators.required, Validators.min(0), numeroDeMesaValidator.mesaExistenteConParametro(this.mesas) ] ),
      fecha1Mesa: new FormControl('', [Validators.required]),
      productoId: new FormControl('', [])
    });
  }


  /*
    * FUNCION AgregarProductoALista
    * agrega el producto seleccionado a una lista para luego agregar dicha lista a la nueva mesa que se va a abrir.
  */
  AgregarProductoALista(){
    for(let i: number = 0; i <= this.productos.length; i++){
      if(this.productos[i].id == this.abrirMesaForm.controls.productoId.value){
        this.lista.push(this.productos[i]);
        break;
      }
    }
  }


  
  /*
    * FUNCINO eliminarProductoDeLista($evet)
    * Elimina el producto de la lista 
    * $event es el numero de Id del producto
  */
  eliminarProductoDeLista($event){
    for(let i: number = 0; i <= this.lista.length; i++){
      if($event.target.value == this.lista[i].id){
        this.lista.splice(i, 1);
        break;
      }
    }
  }




  /*
    * FUNCION abrirNuevaMesa
    * Crea una nueva mesa (temporal) asignandole el estado de la mesa a true, la lista de productos agregadas anteriormente, pone los precios correspondientes
    * Y agrega esta mesa a la lista "this.mesas".
    * Envia esta mesa al servidor y limpia los formularios.
    * Una vez que envio la mesa al servidor necesito actualizar la lista de mesas "this.mesas" para traer el id de la mesa
    * Por ultimo limpio el formulario "abrirMesaForm"
  */
  abrirNuevaMesa(){
    let mesa: mesaProductos = new mesaProductos();
    mesa.numero_mesa = this.abrirMesaForm.controls.numeroMesa.value;
    mesa.estado = true;
    mesa.fecha = this.abrirMesaForm.controls.fecha1Mesa.value;
    mesa.precioTemporal = 0;
    mesa.productosCobrados = [];
    mesa.listaProductos = this.lista;
    mesa.precioTotal = 0;
    for(let e in this.lista){
      mesa.precioTotal = mesa.precioTotal + mesa.listaProductos[e].precio;
    }
    this.mesas.push(mesa);
    this.mesaProductoService.postAbrirMesa(mesa);
    this.lista = [];

    this.mesaProductoService.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });

    this.abrirMesaForm =  this.fb.group({
      numeroMesa: new FormControl('', [Validators.required, Validators.min(0)]),
      fecha1Mesa: new FormControl('', [Validators.required]),
      productoId: new FormControl('', [])
    });
  }






  /*
    * FUNCION agregarMuchosProductos()
    * Agrega el producto elegido a una nueva lista para luego enviar al servidor a la mesa con la nueva lista de productos.
    * No recibe parametros no retorna ningun valor.
  */
  agregarMuchosProductos(){
    for(let i in this.mesas){
      if(this.numeroMesa.value == this.mesas[i].id){
        for(let e =0; e <= this.productos.length; e++){
          if(this.numeroDeProducto.value == this.productos[e].numeroProducto){
            this.lista2.push(this.productos[e]);
            console.log("ACTUALIZADO lista=", this.lista2);
            break;   
          }
        }
      }
    }
  }



  /*
    * Funcion eliminarProductoDeLaLista2 
    * Elimina el producto de la lista2, que es una lista temporal para luego actualizar la lista de productos de la mesa.
    * Recibe como parametro el numero de producto a eliminar.
    * No retorna ningun tipo de parametro.
  */
  eliminarProductoDeLaLista2($event){
    for(let i: number =0; i <= this.lista2.length; i++){
      if($event.target.value == this.lista2[i].numeroProducto){
        this.lista2.splice(i, 1);
        break;
      }
    }
  }



  /*
    * FUNCION enviandoMuchosProductos
    * Agrega la lista de productos (lista2) a la lista de productos de la mesa(this.mesas.listaProductos), y actualiza el precio total de la mesa
    * Y envia al servidor para actualizar la base de datos
    * Inicializa la lista2 a vacia, para luego poder volver a utilizarla
    * No recibe parametros y no retorna parametros
  */
  enviandoMuchosProductos(){
    for(let i in this.mesas){
      if(this.numeroMesa.value == this.mesas[i].id){
        this.mesas[i].listaProductos = this.lista2.concat(this.mesas[i].listaProductos);
        this.mesas[i].precioTotal = 0;
        for(let e in this.mesas[i].listaProductos){
          this.mesas[i].precioTotal = this.mesas[i].precioTotal + this.mesas[i].listaProductos[e].precio;
        }     
        this.mesaProductoService.postActualizar(this.mesas[i]);
        console.log("enviando la mesa == ,", this.mesas[i]);
        this.lista2 = [];
        this.numeroDeProducto = new FormControl('', [Validators.required]);
        this.numeroMesa = new FormControl('', [Validators.required]);    
        break;
      } 
    }
  }




  /*
    *  FUNCION verUnaMesa
    * Inicializa la variable verMesaCobrar en true para visualizar la mesa elegida en el html
    * Logra esto recorriendo todas las mesas abiertas actuales y comparando su numero de mesa con el numero de mesa ingresado por un FormControl
    * Inicializa la variable MesaUnica con los datos de la mesa elegida
  */
  verUnaMesa(){
    this.verMesaCobrar = true;
    for(let i: number = 0; i <= this.mesas.length; i++){
      if(this.numeroMesa.value == this.mesas[i].numero_mesa){
        this.mesaUnica = this.mesas[i];
        break;
      }
    }
  }



  /*  FUNCION cobrarProducto
    * La funcion recibe mediante $event el producto, a este producto lo elimina de la lista de productos de la mesa y lo agrega a la lista de productos
    * cobrados.
    * Y actualiza el precio temporal 
  */
  cobrarProducto($event){
    for(let i: number = 0; i <= this.mesaUnica.listaProductos.length; i++){
      if($event.target.value == this.mesaUnica.listaProductos[i].id){
        this.mesaUnica.productosCobrados.push(this.mesaUnica.listaProductos[i]);
        this.mesaUnica.precioTemporal = this.mesaUnica.precioTemporal + this.mesaUnica.listaProductos[i].precio;
        this.mesaUnica.listaProductos.splice(i, 1);
        this.mesaProductoService.postActualizar(this.mesaUnica);
        break; 
      }
    }
  }




  /*
  */
  deshacerCambioCobrarProducto($event){
    for(let i: number = 0; i <= this.mesaUnica.productosCobrados.length; i++){
      if($event.target.value == this.mesaUnica.productosCobrados[i].id){
          this.mesaUnica.listaProductos.push(this.mesaUnica.productosCobrados[i]);
          this.mesaUnica.precioTemporal = this.mesaUnica.precioTemporal - this.mesaUnica.productosCobrados[i].precio;
          this.mesaUnica.productosCobrados.splice(i, 1);
          this.mesaProductoService.postActualizar(this.mesaUnica);
        break;
      }
    }
  }



  cobrarMesa(){
    for(let i:number = 0; i <= this.mesas.length; i++){
      if(this.mesaUnica.numero_mesa == this.mesas[i].numero_mesa){
        console.log("1- this.mesas", this.mesas, "\n1- this.mesaMesas[i]", this.mesas[i]);
        this.mesas[i].estado = false;
        this.mesas[i].listaProductos = this.mesas[i].listaProductos.concat(this.mesas[i].productosCobrados);    
        this.mesas[i].productosCobrados = [];
        this.mesas[i].formaDePago = 'efectivo';
        this.mesas[i].precioTemporal = 0;  

        this.mesaProductoService.postCerrarMesa(this.mesas[i]);
        this.mesas.splice(i, 1);
        this.mesaUnica = new mesaProductos();
        break;
      }
    }

  }


}
