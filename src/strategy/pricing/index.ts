import { Item, PRODUCT_TYPE } from "../../item";

export class PricingStrategy implements Item {
    private readonly base: Item;

    get unitprice(){
        return this.base.unitprice
    }

    get description() {
        return this.base.description
    } 

    get type() {
        return this.base.type;
    }

    constructor(item: Item) {
        this.base = item;
    }

    calculatePriceForQuantity(quantity: number): number {
        return this.base.calculatePriceForQuantity(quantity);
    }
}

export class CategoryPricing extends PricingStrategy {

    private readonly category: PRODUCT_TYPE;
    private readonly pricingFactor: number

    constructor(base: Item, category: PRODUCT_TYPE, discountPercent : number) {
        super(base);
        this.category = category;
        if(discountPercent < 0 || discountPercent > 100) {
            throw new Error('Invalid Argument')          
        }
        this.pricingFactor = (100 - discountPercent) / 100;
    }

    calculatePriceForQuantity(quantity: number): number {
        if(this.type === this.category) {
            return super.calculatePriceForQuantity(quantity) * this.pricingFactor;
        }
        return super.calculatePriceForQuantity(quantity);
    }
}