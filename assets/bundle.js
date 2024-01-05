const addButton = document.querySelector(".add-button");
const bundledProducts = document.querySelector(".bundled-products");

// addButton.addEventListener("click", function() {
//     console.log('test')
// });

function addProduct(product_title, product_id, product_img) {
    let productImg = document.createElement("img");
    let productTitle = document.createElement("div");
    
    productImg.setAttribute('src', product_img);
    productTitle.innerHTML = product_title;
    
    productTitle.appendChild(productImg);
    bundledProducts.appendChild(productTitle);
    
    prodArray = {
        productTitle: product_title,
        productImage: product_img,
        productId: product_id
    }    
    console.log(prodArray)

}
 


