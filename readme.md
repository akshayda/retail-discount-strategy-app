## Getting Started

### <p>Prerequisite</p>
<pre>
<code>$ node -v
v10.x.x</code>
</pre>

### <p>Download the package and Run command to install packages:</p>
<pre>
<code>$ npm install</code>
</pre>

### <p>To run test:</p>
<pre><code>$ npm run test</code>
</pre>

### <p>To generate Code Coverage:</p>
<pre><code>$ npm run test-coverage</code>
</pre>
![Code Coverage Screenshot](./test-coverage-sh.png)

## UML Diagram
![UML Diagram](./uml.svg)

## Solution

1. There are 2 kinds of Discount Strategy:
   - Item Level (PricingStrategy)
     - This strategy gets applied while adding an item to Cart
     - Current implementation only include CategoryPricing as an implementation of PricingStrategy
   - Cart or Order Level (DiscountStrategy)
     - This strategy gets applied while calculating total amount
     - Current implementation only included OrderDiscount as an implementation of DiscountStrategy.
2. Solution is developed using Typescript and uses Mocha / Chai for unit testing.