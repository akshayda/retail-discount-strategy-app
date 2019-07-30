
export interface DiscountStrategy {
    applyDiscount(total: number): number
}

export class OrderDiscount implements DiscountStrategy {
    applyDiscount(total: number): number {
        const factor = Math.floor(total / 100);
        if(factor > 0) {
            const discount = factor * 5
            return total - discount;
        }
        return total;
    }
}