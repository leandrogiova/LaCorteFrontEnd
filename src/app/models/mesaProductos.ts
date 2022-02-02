import { Producto } from "./producto";

export class mesaProductos{

    id: number;
    numero_mesa: number;
    listaProductos: Producto[];
    estado: boolean;
    fecha: Date;
    precioTotal: number;
    precioTemporal: number;
    formaDePago: string;
    detalle: string;

    productosCobrados: Producto[];

    constructor(){
    }



}