import { AbstractControl } from "@angular/forms"; 
import { mesaProductos } from "../models/mesaProductos";


export class numeroDeMesaValidator{

    static mesaExistenteConParametro(mesas: mesaProductos[]){
        return (control: AbstractControl) => {
            const value = control.value;
            let varBool: boolean = false;
            for(let i in mesas){
                if(value == mesas[i].numero_mesa){
                    varBool = true;
                    break;
                }
            }       
            if(varBool == true){
                return {mesaExistente: true}
            }
            else{
                return null;
            }
        }
    }
}