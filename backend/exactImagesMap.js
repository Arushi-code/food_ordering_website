const fs = require('fs');

const exactImageMap = {
  'Classic Cheeseburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
  'Double Bacon Smash': '/double_bacon_smash.jpg',
  'Texas BBQ Burger': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80',
  'Veggie Bean Burger': 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&q=80',
  'Truffle Fries': '/truffle_fries.jpg',
  'Loaded Nachos': '/loaded_nachos.jpg',
  'Vanilla Milkshake': '/vanilla_milkshake.png',
  'BBQ Wings (6pcs)': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
  'Onion Rings': 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80',
  
  'Spicy Tuna Roll': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
  'Salmon Sashimi (5pcs)': '/salmon_sashimi.jpg',
  'Dragon Roll': '/dragon_roll.png',
  'California Roll': '/california_roll.png',
  'Veggie Sushi Roll': '/veggie_sushi_roll.jpg',
  'Miso Soup': '/miso_soup.png',
  'Edamame': '/edamame.jpg',
  
  'Al Pastor Tacos (3)': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80',
  'Carne Asada Burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80',
  'Chicken Enchiladas': '/chicken_enchiladas.jpg',
  'Veggie Fajita Bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  'Mushroom Tacos (3)': '/mushroom_tacos.jpg',
  'Chips & Queso': '/chips_and_queso.png',
  'Chicken Quesadilla': '/chicken_quesadilla.jpg',
  'Churros': '/churros.jpg',
  
  'Quinoa Power Bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  'Acai Smoothie Bowl': 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=500&q=80',
  'Avocado Toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80',
  'Greek Salad': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
  'Green Detox Juice': '/green_detox_juice.png',
  'Vegan Chocolate Brownie': '/vegan_chocolate_brownie.png',
  
  'Kung Pao Chicken': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80',
  'Chilli Paneer': 'https://images.unsplash.com/photo-1551881192-002e02ad3d87?w=500&q=80',
  'Veg Hakka Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
  'Chicken Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
  'Pork Dumplings (6pcs)': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80',
  'Veg Spring Rolls (4pcs)': '/veg_spring_rolls.jpg',
  'Sweet and Sour Chicken': '/sweet_and_sour_chicken.png',
  
  'Margherita Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
  'Pepperoni Pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
  'Mushroom & Truffle Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
  'Penne Arrabbiata': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80',
  'Chicken Alfredo': 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80',
  'Garlic Bread with Cheese': '/garlic_bread.png',
  'Tiramisu': '/tiramisu.png',
  
  'Beef Bulgogi': 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=500&q=80',
  'Pork Belly (Samgyeopsal)': 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=500&q=80',
  'Bibimbap (Veg)': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=500&q=80',
  'Korean Fried Chicken (6pcs)': '/korean_fried_chicken.jpg',
  'Kimchi Fried Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
  'Tteokbokki': '/tteokbokki.png',
  
  'Butter Chicken': '/butter_chicken.png',
  'Mutton Rogan Josh': '/mutton_rogan_josh.jpg',
  'Paneer Tikka Masala': '/paneer_tikka_masala.png',
  'Palak Paneer': '/palak_paneer.jpg',
  'Dal Makhani': '/dal_makhani.jpg',
  'Chicken Biryani': '/chicken_biryani.jpg',
  'Veg Biryani': '/veg_biryani.png',
  'Garlic Naan': '/garlic_naan.jpg', 
  'Samosa (2pcs)': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
  
  'Red Velvet Cupcake': 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80',
  'Chocolate Truffle Cake (1kg)': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
  'Black Forest Cake (500g)': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80',
  'Blueberry Cheesecake Slice': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80',
  'Macarons (Box of 5)': 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&q=80',
  'Gulab Jamun (2pcs)': '/gulab_jamun.png',
  'Rasmalai (2pcs)': '/rasmalai.jpg'
};

const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';

let code = fs.readFileSync('server.js', 'utf8');

// Strip old image urls correctly
code = code.replace(/,\s*image:\s*'.*?'(\s*\})/g, '$1');

code = code.replace(/(\{\s*name:\s*'(.*?)',\s*price:\s*\d+,\s*description:\s*'.*?'\s*)\}/g, (match, p1, name) => {
  let matchedImage = exactImageMap[name] || defaultImage;
  return `${p1}, image: '${matchedImage}' }`;
});

fs.writeFileSync('server.js', code);
console.log('Exact images added for all specific items.');
