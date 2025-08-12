import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as needed

const handbagJson = 

   {
    "season": "SS25",
    "name": "Gardens of the world Greece",
    "releaseDate": "21-03-2025",
    "range": "Boutique",
    "variations": {
      "size": [],
      "design": [
        {
          "price": 105.00,
          "shape": "Bonnie Weekender",
          "category": [
            "Accessory"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Bonnie Weekender",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/k/1/k11163321_gardens_of_the_world_greece_bonnie_weekender_front.jpg"
        },
        {
          "price": 20.00,
          "shape": "Key Charm",
          "category": [
            "Accessory",
            "Charm"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Key Charm",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/c/2/c24993321_gardens_of_the_world_greece_key_charm_1.jpg"
        },
        {
          "price": 115.00,
          "shape": "Mimi Cat Bag",
          "category": [
            "Handbag"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Mimi Cat Bag",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/k/9/k95203321_gardens_of_the_world_greece_mimi_cat_bag_front.jpg"
        },
        {
          "price": 30.00,
          "shape": "Round Coin Purse",
          "category": [
            "Purse"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Round Coin Purse",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/k/3/k32093321_gardens_of_the_world_greece_round_coin_purse_front.jpg"
        },
        {
          "price": 100.00,
          "shape": "Stella Tote",
          "category": [
            "Accessory"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Stella Tote",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/k/1/k14013321_gardens_of_the_world_greece_stella_tote_front.jpg"
        },
        {
          "price": 35.00,
          "shape": "Universal Flip Phone Case",
          "category": [
            "Accessory",
            "Phone Case"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Universal Flip Phone Case",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/c/4/c42193321_gardens_of_the_world_greece_universal_flip_phone_case_1.jpg"
        },
        {
          "price": 95.00,
          "shape": "Noa Bag",
          "category": [
            "Handbag"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Noa Bag",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/k/9/k95183321_gardens_of_the_world_greece_noa_bag_front.jpg"
        },
        {
          "price": 75.00,
          "shape": "Gia Bag",
          "category": [
            "Handbag"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Gia Bag",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/k/7/k75193321_gardens_of_the_world_greece_gia_bag_front.jpg"
        },
        {
          "price": 30.00,
          "shape": "Zipper Card and Coin Purse",
          "category": [
            "Purse"
          ],
          "favourite": false,
          "name": "Gardens of the world Greece Zipper Card and Coin Purse",
          "imageUrl": "https://www.vendulalondon.com/media/catalog/product/cache/359604771e0fd1730ccffcd509b79cd0/c/3/c34063321_gardens_of_the_world_greece_zipper_card_and_coin_purse_front_1.jpg"
        }
      ],
      "color": [
        "Blue",
        "White",
        "Yellow"
      ],
      "theme": [
        "Travel",
        "Garden",
        "Summer",
        "Floral",
        "Greece",
        "Cat"
      ]
    },
    "favourite": false
  }

const AddHandbagButton = () => {
  const addHandbag = async () => {
    try {
      const docRef = await addDoc(collection(db, "handbags"), handbagJson);
      alert(`Handbag added with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding handbag:", error);
      alert("Failed to add handbag. See console for details.");
    }
  };

  return (
    <button
      style={{
        padding: "10px 20px",
        backgroundColor: "#0069d9",
        color: "white",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
        marginTop: 20
      }}
      onClick={addHandbag}
    >
      Add Handbag JSON to Firestore
    </button>
  );
};

export default AddHandbagButton;
