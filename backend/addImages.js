const fs = require('fs');

const imageMap = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
  fries: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80',
  nachos: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&q=80',
  milkshake: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8fc?w=500&q=80',
  wings: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
  onion: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
  roll: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
  sashimi: 'https://images.unsplash.com/photo-1534604973900-c4335533cb3f?w=500&q=80',
  soup: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
  edamame: 'https://images.unsplash.com/photo-1548943487-a2e4f43b485d?w=500&q=80',
  taco: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80',
  burrito: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80',
  enchilada: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=500&q=80',
  bowl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  queso: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&q=80',
  quesadilla: 'https://images.unsplash.com/photo-1618040911158-ce18146af8e9?w=500&q=80',
  churro: 'https://images.unsplash.com/photo-1624371414361-e670edf48f8d?w=500&q=80',
  toast: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80',
  brownie: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
  chicken: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&q=80',
  noodle: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
  rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
  dumpling: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80',
  penne: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80',
  garlic: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80',
  tiramisu: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80',
  beef: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
  pork: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=500&q=80',
  bibimbap: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=500&q=80',
  tteokbokki: 'https://images.unsplash.com/photo-1635565576189-d830b5da909b?w=500&q=80',
  mutton: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80',
  dal: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
  biryani: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&q=80',
  naan: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
  samosa: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
  cupcake: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
  macaron: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&q=80',
  jamun: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=500&q=80',
  rasmalai: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=500&q=80'
};

const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';

let code = fs.readFileSync('server.js', 'utf8');

// First, remove existing images from the menu array elements
code = code.replace(/,\s*image:\s*'.*?'\s*(\})/g, '$1');

// Then, add them back using the map
code = code.replace(/(\{\s*name:\s*'(.*?)',\s*price:\s*\d+,\s*description:\s*'.*?'\s*)\}/g, (match, p1, name) => {
  let matchedImage = defaultImage;
  const lowerName = name.toLowerCase();
  for (const [key, url] of Object.entries(imageMap)) {
    if (lowerName.includes(key)) {
      matchedImage = url;
      break;
    }
  }
  return `${p1}, image: '${matchedImage}' }`;
});

fs.writeFileSync('server.js', code);
console.log('Specific images added based on item names.');
