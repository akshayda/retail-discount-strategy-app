import { User, CUSTOMER_TYPE } from "../user";
import { Item, PRODUCT_TYPE } from "../item";
import {DiscountStrategy} from "../strategy/discount"
import { CategoryPricing } from "../strategy/pricing";

type CartItem = {
    item: Item,
    quantity: number
}

export class Cart {
    private user: User;
    private cartItems: Array<CartItem> = []
    private discountStrategy: Array<DiscountStrategy> = []

    constructor(user: User) {
        this.user = user;
    }

    addDiscountStrategy(discountStrategy: DiscountStrategy):Cart {
        this.discountStrategy = [...this.discountStrategy,discountStrategy]
        return this;
    }

    addToCart(item: Item, quantity: number):Cart {
        if(quantity < 1) {
            throw new Error('Invalid Quantity');
        }

        // Apply Pricing Strategy for individual Items
        item = new CategoryPricing(item,PRODUCT_TYPE.OTHER, this.user.discountPercent);

        this.cartItems = [...this.cartItems, {item,quantity}]
        return this;
    }

    calculateCartTotal():number {
        let totalAmount : number;

        // calculate total price
        totalAmount = this.cartItems.reduce((previous: number, current: CartItem) : number => {
            previous += current.item.calculatePriceForQuantity(current.quantity)
            return previous;
        },0)

        // calculate
        this.discountStrategy.forEach((value: DiscountStrategy) => {
            totalAmount = value.applyDiscount(totalAmount)
        })

        return totalAmount
    }
}
