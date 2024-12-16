import { products } from "./data.js";

const loadEvent = function () {
  const rootElement = document.getElementById("root");

  productMainDetails(rootElement);
};

function productMainDetails(rootElement) {
  products.forEach((product) => {
    const productElements = [
      { tag: "h1", text: `Album name: ${product.name}` },
      { tag: "h2", text: `Status: ${product.status}` },
      { tag: "h3", text: `Price: ${product.price}` },
    ];

    const productContainer = createElements(productElements);
    productSubDetails(productContainer, product);
    rootElement.appendChild(productContainer);
  });
}

function productSubDetails(parentContainer, product) {
  product.details.forEach((details) => {
    const detailElements = [
      { tag: "h2", text: `Track name: ${details.name}` },
      { tag: "h3", text: `Track id: ${details.track_id}` },
      { tag: "h4", text: `Album id: ${details.album_id}` },
    ];
    const detailContainer = createElements(detailElements);

    parentContainer.appendChild(detailContainer);
  });
}

function createElements(elements) {
  const parent = document.createElement("div");

  elements.forEach(({ tag, text }) => {
    const child = document.createElement(tag);
    child.textContent = text;
    parent.appendChild(child);
  });

  return parent;
}

window.addEventListener("load", loadEvent);
