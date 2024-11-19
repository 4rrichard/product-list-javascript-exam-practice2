import { products } from './data.js';

const loadEvent = function() {
  console.log(products[0]);

}

window.addEventListener("load", loadEvent);
