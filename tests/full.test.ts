import { assert, expect } from 'chai'
import { User, CUSTOMER_TYPE } from '../src/user';
import { Cart } from '../src/cart';
import { Product, PRODUCT_TYPE } from '../src/item';
import { PricingStrategy, CategoryPricing } from '../src/strategy/pricing';
import { OrderDiscount } from '../src/strategy/discount';

// User tests

describe('Employee', function() {
    describe('Validate discount percent', function() {
      it('discount Percent is equal to 30', function() {
        const user = new User('akshay',new Date('10-10-2013'),CUSTOMER_TYPE.Employee);
        assert.equal(user.discountPercent,30);
      });
      it('date range has no impact on percentage', function() {
        const user = new User('akshay',new Date('10-10-2018'),CUSTOMER_TYPE.Employee);
        assert.equal(user.discountPercent,30);
      });
    });
  });

  describe('Affiliate', function() {
    describe('Validate discount percent', function() {
      it('discount Percent is equal to 10', function() {
        const user = new User('akshay',new Date('10-10-2013'),CUSTOMER_TYPE.Affiliate);
        assert.equal(user.discountPercent,10);
      });
      it('date range has no impact on percentage', function() {
        const user = new User('akshay',new Date('10-10-2018'),CUSTOMER_TYPE.Affiliate);
        assert.equal(user.discountPercent,10);
      });
    });
  });

  describe('Normal Customer', function() {
    describe('Validate discount percent', function() {
      it('discount Percent is equal to 0 for customer registered < 2 years', function() {
        const user = new User('akshay',new Date('10-10-2018'));
        //console.log(user);
        assert.equal(user.discountPercent,0);
      });
      it('discount Percent is equal to 5 for customer registered > 2 years', function() {
        const user = new User('akshay',new Date('10-10-2016'));
        assert.equal(user.discountPercent,5);
      });
    });
  });

  describe('User Properties', function() {
    const user = new User('akshay',new Date('10-10-2018'));
    it('has name akshay and customer type as normal and discount as 0', function() {
        assert.propertyVal(user,'name','akshay');
        assert.propertyVal(user,'type',CUSTOMER_TYPE.Normal);
        assert.propertyVal(user,'discountPercent',0);
    });
  });


// item tests

describe('Item', function() {
  const item = new Product("Vegetable",10,PRODUCT_TYPE.GROCERY);
  it('sku is not null and not empty', function() {
    assert(item.sku);
  });
  describe('No pricing strategy', function() {
    it('should be equal to quantity * unit price', function() {
      assert.equal(item.calculatePriceForQuantity(10),100);
    });
  });
  describe('With default pricing strategy', function() {
    it('should be equal to quantity * unit price', function() {
      const newItem = new PricingStrategy(item);
      assert.equal(newItem.calculatePriceForQuantity(10),100);
    });
  });
  describe('Item is a Grocery --> Included Discount Category as Grocery', function() {
    it('should be equal to quantity * unit price * discountFactor', function() {
      const newItem = new CategoryPricing(item,PRODUCT_TYPE.GROCERY,30);
      assert.equal(newItem.calculatePriceForQuantity(10),70);
    });
  });
  describe('Item is a Grocery --> Included Discount Category as Other', function() {
    it('should be equal to quantity * unit price', function() {
      const newItem = new CategoryPricing(item,PRODUCT_TYPE.OTHER,30);
      assert.equal(newItem.calculatePriceForQuantity(10),100);
    });
  });
});

// testing cart

describe('Cart', function() {
  const employee: User = new User('Employee',new Date('10-10-2013'),CUSTOMER_TYPE.Employee);
  const affiliate: User = new User('Affiliate',new Date('10-10-2013'),CUSTOMER_TYPE.Affiliate);
  const normalLessThan2: User = new User('Normal Less',new Date('10-10-2018'));
  const normalMoreThan2: User = new User('Normal More',new Date('10-10-2013'));
  const Grocery1 = new Product("Juice",10,PRODUCT_TYPE.GROCERY);
  const Grocery2 = new Product("Vegetable",10,PRODUCT_TYPE.GROCERY);    
  const Other1 = new Product("Juicer",200,PRODUCT_TYPE.OTHER);    
  const Other2 = new Product("Laptop",1000,PRODUCT_TYPE.OTHER);    
  
  describe('With Grocery Only', function() {
    const cart = new Cart(employee);
    cart.addToCart(Grocery1, 10)
        .addToCart(Grocery2,10);
    
    it('should apply no discount, total 200', function() {
      assert.equal(cart.calculateCartTotal(),((10 * 10) + (10 * 10)));
    });
    
    it('should apply only Order discount $5 for every $100, total 190', function() {
      cart.addDiscountStrategy(new OrderDiscount())
      assert.equal(cart.calculateCartTotal(), 200 - 10);
    });
  });
  
  describe('With Other Item Only - Employee', function() {
    const cart = new Cart(employee);
    cart.addToCart(Other1, 10)
        .addToCart(Other2,1);
    
    it('should apply 30% discount for employee, total 2100', function() {
      assert.equal(cart.calculateCartTotal(),2100);
    });
    
    it('should apply 30% and Order discount $5 for every $100, total 1995', function() {
      cart.addDiscountStrategy(new OrderDiscount())
      assert.equal(cart.calculateCartTotal(), 1995);
    });
  });
  
  describe('With Other Item Only - Affiliate', function() {
    const cart = new Cart(affiliate);
    cart.addToCart(Other1, 10)
        .addToCart(Other2,1);
    
    it('should apply 10% discount for Affiliate, total 2700', function() {
      assert.equal(cart.calculateCartTotal(),2700);
    });
    
    it('should apply 10% and Order discount $5 for every $100, total 2565', function() {
      cart.addDiscountStrategy(new OrderDiscount())
      assert.equal(cart.calculateCartTotal(), 2565);
    });
  });

  describe('With Other Item Only -> Normal User More than 2 years', function() {
    const cart = new Cart(normalMoreThan2);
    cart.addToCart(Other1,10)
        .addToCart(Other2,1);
    
    it('should apply 5% discount, total 2850', function() {
      assert.equal(cart.calculateCartTotal(),2850);
    });
    
    it('should apply 5% discount and Order discount $5 for every $100, total 2710', function() {
      cart.addDiscountStrategy(new OrderDiscount())
      assert.equal(cart.calculateCartTotal(), 2710);
    });
  });

  describe('With Other Item Only -> Normal User Less than 2 years', function() {
    const cart = new Cart(normalLessThan2);
    cart.addToCart(Other1,10)
        .addToCart(Other2,1);
    
    it('should apply no discount', function() {
      assert.equal(cart.calculateCartTotal(),3000);
    });
    
    it('should only apply Order discount $5 for every $100, total 2850', function() {
      cart.addDiscountStrategy(new OrderDiscount())
      assert.equal(cart.calculateCartTotal(), 2850);
    });
  });
});

// Discount Strategy Testing
describe('Order Discount', function() {
  const discountStrategy =  new OrderDiscount()

  describe('Apply $5 discount on every $100', function() {
    it('should apply $5 discount', function() {
      assert.equal(discountStrategy.applyDiscount(100), 95);
    });

    it('should apply no discount', function() {
      assert.equal(discountStrategy.applyDiscount(99), 99);
    });

  });
})

// Pricing Strategy Testing
describe('Pricing Strategy', function() {
  const item = new Product("Juice",10,PRODUCT_TYPE.GROCERY);   
  const pricingStrategy = new CategoryPricing(item,PRODUCT_TYPE.OTHER,10);

  describe('verify properties', function() {
    it('has unitprice with value 10', function() {
      assert.propertyVal(pricingStrategy, 'unitprice', 10);
    });
    it('has description with value Juice', function() {
      assert.propertyVal(pricingStrategy, 'description', 'Juice');
    });
  });
})


// Error conditions
describe('Error Handling', function() {
  const employee: User = new User('Employee',new Date('10-10-2013'),CUSTOMER_TYPE.Employee);
  const item = new Product("Juice",10,PRODUCT_TYPE.GROCERY);   
  const cart = new Cart(employee)

  describe('Category Pricing - Invalid Percentage', function() {
    it('should throw an error', function() {
      assert.throws(function() {
        const pricingStrategy = new CategoryPricing(item,PRODUCT_TYPE.OTHER,120);
      })
    });
  });

  describe('Cart - Invalid Quantity', function() {
    it('should throw an error', function() {
      assert.throws(function() {
        cart.addToCart(item,-1);
      })
    });
  });

  describe('User - Invalid Registration Date', function() {
    it('should throw an error', function() {
      assert.throws(function() {
        new User('Name',new Date('10-10-2020'),CUSTOMER_TYPE.Employee);
      })
    });
  });

})