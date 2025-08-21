/*https://www.vendulalondon.com/sitemap.xml */

const productsData = [];
let
season = "AW25",
arr = [],
sizeArr = [],
rdate="08-08-2025",
version,
desArr = [],
colorArr = ["Green", "Brown", "Cream"],
themeArr = ["Food","Dessert","Autumn"],
collectionImage,
range="Shopfront",
name1="Vendula Pie Shop";

let obj = {
        season:season,
         name: name1, 
         releaseDate:rdate, 
         range:range, 
         variations: {
            size: sizeArr,
            version: version,
            design: desArr,
            color: colorArr,
            theme: themeArr

      } ,
      imageURL: collectionImage,
      favourite: false
      }

// query prods
document.querySelectorAll('.products.wrapper.mgs-products.grid.products-grid.mf-initial > ol > li.item.product').forEach(product => {
    const favourite = false;
  // Get price text
  const priceEl = product.querySelector('.price-box .price');
  const price = priceEl ? priceEl.textContent.trim() : null;
//const price = parseInt(price1, 10)
  // Get second-thumb image inside the product
  const secondThumbImg = product.querySelector('.second-thumb img.product-image-photo');
  const imageUrl = secondThumbImg ? secondThumbImg.src : null;
 let name = secondThumbImg ? secondThumbImg.alt : null;
//category 
let category = getCat(name)

  // get category
 function getCat(n) {
    var catArr = ["Wallet","Purse","Bag","Backpack","Crossbody","Phone Case","Strap","Charm", "Accessory"];
     var c = [];

  
    catArr.forEach(ca => { 
   
    var s = n.search(ca);
    var newName;
     if(s > 0) {
         if(ca == "Bag"){
            newName = "Handbag"
         }else {
            newName = ca;
         }
         
         if(ca == "Strap" || ca == "Phone Case" || ca == "Charm") {
            c.push("Accessory");
         }
      c.push(newName)
    }
   

    })
    if(c.length == 0){
        c.push("Accessory");
    }
  
    return c;
}


//shape
const shape = name.replace(name1,"").trim();


  desArr.push({
    price,
    shape,
    category,
    favourite,
    name,
    imageUrl
  
  });
});
productsData.push(obj)

console.log(JSON.stringify(productsData, null, 2));


document.querySelectorAll('url').forEach(p => {
console.log(p)

})