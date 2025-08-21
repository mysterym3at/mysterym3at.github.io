
const productsData = [];
let
season = "SS24",
arr = [],
sizeArr = [],
rdate="08-08-2025",
version,
desArr = [],
colorArr = ["Green", "Brown", "Cream"],
themeArr = ["Food","Dessert","Autumn"],
collectionImage,
range="Shopfront",
name1="Fairy Village",
xArr = []

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

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
// query prods
document.querySelectorAll('.hCL').forEach(product => {
const favourite = false;
// Get price text
const priceEl = ""
const price = priceEl ? priceEl.textContent.trim() : null;
//const price = parseInt(price1, 10)
  // Get second-thumb image inside the product
 // const secondThumbImg = product.querySelector('.hCL');
const imageUrl = product ? product.src : null;
const alt = product.alt
const name2 = product ? product.alt : null;
const name= name2.split(":",2).pop()
// console.log(name)
//category 
const category = getCat(name)

function getCat(n) {
    var catArr = ["Wallet","Purse","Bag","Tote","Backpack","Phone Case","Strap","Charm", "Accessory"];
     var c = [];
    catArr.forEach(ca => { 
    var s = n.search(ca);
    var newName;
     if(s > 0) {
         if(ca == "Bag" || ca == "Tote") {
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

if(name.includes(name1)){
 xArr.push(shape);
}
  //  console.log(name2.includes(name1))
});
var unique = xArr.filter(onlyUnique);


//productsData.push(obj)
//console.log(xArr)
//console.log(JSON.stringify(productsData, null, 2));

// usage example:


console.log(unique); 