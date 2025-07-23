import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config({ path: './config.env' });

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Sample products data
const products = [
  {
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    description: truncateText("Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday", 500),
    price: 109.95,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: {
      rate: 3.9,
      count: 120
    },
    stock: 50,
    featured: true
  },
  {
    title: "Mens Casual Premium Slim Fit T-Shirts",
    description: truncateText("Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.", 500),
    price: 22.3,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: {
      rate: 4.1,
      count: 259
    },
    stock: 100,
    featured: false
  },
  {
    title: "Mens Cotton Jacket",
    description: truncateText("Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.", 500),
    price: 55.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: {
      rate: 4.7,
      count: 500
    },
    stock: 75,
    featured: true
  },
  {
    title: "Mens Casual Slim Fit",
    description: truncateText("The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.", 500),
    price: 15.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    rating: {
      rate: 2.1,
      count: 430
    },
    stock: 200,
    featured: false
  },
  {
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    description: truncateText("From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.", 500),
    price: 695,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    rating: {
      rate: 4.6,
      count: 400
    },
    stock: 25,
    featured: true
  },
  {
    title: "Solid Gold Petite Micropave",
    description: truncateText("Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.", 500),
    price: 168,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    rating: {
      rate: 3.9,
      count: 70
    },
    stock: 40,
    featured: false
  },
  {
    title: "White Gold Plated Princess",
    description: truncateText("Classic Created Wedding Engagement Earrings, Fine Jewelry Gift for Women, Wives, Girlfriends, Brides, Bridesmaids, Anniversary, Valentine's Day, Mother's Day, Christmas, Birthday, Anniversary, Valentine's Day, Mother's Day, Christmas, Birthday", 500),
    price: 9.99,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71YAojUJsHL._AC_UL640_QL65_ML3_.jpg",
    rating: {
      rate: 3,
      count: 400
    },
    stock: 150,
    featured: false
  },
  {
    title: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    description: truncateText("Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel", 500),
    price: 10.99,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
    rating: {
      rate: 1.9,
      count: 100
    },
    stock: 80,
    featured: false
  },
  {
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    description: truncateText("USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user's hardware configuration and operating system", 500),
    price: 64,
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    rating: {
      rate: 3.3,
      count: 203
    },
    stock: 30,
    featured: false
  },
  {
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    description: truncateText("Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5\" hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read speeds up to 535MB/s Write speeds up to 450MB/s", 500),
    price: 109,
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    rating: {
      rate: 2.9,
      count: 470
    },
    stock: 20,
    featured: true
  },
  {
    title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
    description: truncateText("3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.", 500),
    price: 109,
    category: "electronics",
    image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
    rating: {
      rate: 4.8,
      count: 319
    },
    stock: 15,
    featured: false
  },
  {
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    description: truncateText("Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty", 500),
    price: 114,
    category: "electronics",
    image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    rating: {
      rate: 4.8,
      count: 400
    },
    stock: 25,
    featured: false
  },
  {
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    description: truncateText("21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz", 500),
    price: 599,
    category: "electronics",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SL1500_.jpg",
    rating: {
      rate: 2.9,
      count: 250
    },
    stock: 10,
    featured: true
  },
  {
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
    description: truncateText("49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag", 500),
    price: 999.99,
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SL1500_.jpg",
    rating: {
      rate: 2.2,
      count: 140
    },
    stock: 5,
    featured: false
  },
  {
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    description: truncateText("Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can wear the coat and jacket separately.", 500),
    price: 56.99,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: {
      rate: 2.6,
      count: 235
    },
    stock: 60,
    featured: false
  },
  {
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    description: truncateText("100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 front-side slant hand pockets, 2-Button-One Hand Cropped Windy style, 2 inner pockets, 1 Size chart, 1 only piece, detachable hooded faux leather jacket, button-down snag-free collar, cuff zip sleeves, knuckle zip front wind pockets, zip internal pocket, chest utility pocket with one hand behind front hidden easy closure pocket, AJ CLASSIC EMBROIDERED ON LEFT CHEST (Made in Turkey) 2 Front pockets, 2 inside pockets, 1 coin insert pocket, 1 digital phone pocket, 2 side mesh hunting pockets, 1 side lanyard, 2-cap holder, 1 secret chest zip security wallet set.", 500),
    price: 29.95,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    rating: {
      rate: 2.9,
      count: 340
    },
    stock: 45,
    featured: false
  },
  {
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    description: truncateText("Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.", 500),
    price: 39.99,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    rating: {
      rate: 3.8,
      count: 679
    },
    stock: 35,
    featured: false
  },
  {
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    description: truncateText("95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem", 500),
    price: 9.85,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    rating: {
      rate: 4.7,
      count: 130
    },
    stock: 120,
    featured: false
  },
  {
    title: "Opna Women's Short Sleeve Moisture",
    description: truncateText("100% Polyester, Machine wash, 100% cationic polyester interlock, Pre-shrunk fabric, Side-seamed construction, Shoulder-to-shoulder taping, Moisture-wicking fabric with 4-way stretch for comfort and mobility", 500),
    price: 7.95,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    rating: {
      rate: 4.5,
      count: 146
    },
    stock: 90,
    featured: false
  },
  {
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    description: truncateText("95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.", 500),
    price: 12.99,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    rating: {
      rate: 3.6,
      count: 145
    },
    stock: 80,
    featured: false
  }
];

// Admin user data
const adminUser = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@ecommerce.com",
  password: "admin123",
  role: "admin"
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Create admin user
    await User.create(adminUser);
    console.log('✅ Admin user created');

    // Create products
    await Product.create(products);
    console.log('✅ Products imported');

    console.log('✅ Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log('✅ Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 