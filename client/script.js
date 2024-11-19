import { products } from "./data.js";

const loadEvent = function () {
  const rootElement = document.getElementById("root");

  products.forEach((product) => {
    const productContainer = document.createElement("div");
    productContainer.innerText = `album name: ${product.name}`;

    const productStatus = document.createElement("h2");
    const productPrice = document.createElement("h3");

    productStatus.innerText = `status: ${product.status}`;
    productPrice.innerText = `price: ${product.price}`;

    productContainer.appendChild(productStatus);
    productContainer.appendChild(productPrice);
    product.details.forEach((details) => {
      const productDetailName = document.createElement("div");
      const productDetailAlbumId = document.createElement("h2");
      const productDetailTrackId = document.createElement("h3");
      productDetailName.innerText = `track name: ${details.name}`;
      productDetailAlbumId.innerText = `album id: ${details.album_id}`;
      productDetailTrackId.innerText = `track id: ${details.track_id}`;
      productContainer.appendChild(productDetailName);
      productContainer.appendChild(productDetailAlbumId);
      productContainer.appendChild(productDetailTrackId);
    });

    rootElement.appendChild(productContainer);
  });
};

window.addEventListener("load", loadEvent);
