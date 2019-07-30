export enum PRODUCT_TYPE {
    GROCERY = 'Grocery', 
    OTHER = 'Others'
}

export interface Item {
    readonly unitprice: number;
    readonly type: PRODUCT_TYPE;
    readonly description: string;
    calculatePriceForQuantity(quantity:number):number
}

export class Product implements Item {
    description: string;
    sku: string;    
    unitprice: number;
    type: PRODUCT_TYPE;
    
    constructor(description: string, unitprice: number, type: PRODUCT_TYPE) {
        this.description = description;
        this.unitprice = unitprice;
        this.type = type;
        this.sku = `${this.type}_${Math.floor(Math.random() * 100000000)}`
    }

    calculatePriceForQuantity(quantity: number): number {
        return quantity * this.unitprice;
    }
}
