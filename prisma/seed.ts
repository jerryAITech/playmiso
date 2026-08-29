import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Toy eCommerce database with Users, Addresses, Coupons, Categories and Products...');

  // Clean existing data
  await prisma.banner.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Dynamic Banners
  const bannersData = [
    {
      title: 'Ignite Imagination With Joyful STEM Kits!',
      subtitle: 'Motorized planetary models, magnetic marble runs & brain puzzles for curious minds.',
      badgeText: '🚀 MEGA TOY SALE • UP TO 40% OFF',
      ctaText: 'Shop STEM Toys',
      linkUrl: '/category/educational-stem',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
      bgGradient: 'from-amber-400 via-orange-300 to-toy-orange',
      order: 1,
      isActive: true,
    },
    {
      title: 'High-Speed 4WD Monster RC Stunt Cars!',
      subtitle: '360° stunt flipping, luminous LED night headlights & 50m remote control range.',
      badgeText: '🏎️ TOP THRILL • CASH ON DELIVERY',
      ctaText: 'Explore RC Cars',
      linkUrl: '/category/rc-cars-vehicles',
      image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=80',
      bgGradient: 'from-sky-400 via-teal-300 to-emerald-400',
      order: 2,
      isActive: true,
    },
    {
      title: 'Super Soft Huggable Cuddle Plushies!',
      subtitle: '100% hypoallergenic, child-safe velvety teddy bears & comforting animal buddies.',
      badgeText: '❤️ 100% NEWBORN & TODDLER SAFE',
      ctaText: 'View Plushies',
      linkUrl: '/category/soft-toys-plushies',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1000&q=80',
      bgGradient: 'from-pink-400 via-rose-300 to-purple-400',
      order: 3,
      isActive: true,
    },
  ];

  for (const ban of bannersData) {
    await prisma.banner.create({ data: ban });
  }
  console.log('Dynamic Banners seeded successfully');

  // Create Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Store Admin',
      email: 'admin@toyjoy.in',
      password: adminPasswordHash,
      phone: '+91 99999 88888',
      role: 'ADMIN',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: customerPasswordHash,
      phone: '9876543210',
      role: 'USER',
      addresses: {
        create: [
          {
            fullName: 'Rahul Sharma',
            phone: '9876543210',
            street: 'Flat 402, Sunshine Heights, MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            isDefault: true,
          },
          {
            fullName: 'Rahul Sharma (Office)',
            phone: '9876543210',
            street: 'Unit 12, Cyber Tech Park, Andheri East',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400069',
            isDefault: false,
          },
        ],
      },
    },
    include: {
      addresses: true,
    },
  });

  console.log('Users created: Admin (admin@toyjoy.in / admin123), Customer (rahul@example.com / user123)');

  // Create Coupons
  const couponsData = [
    {
      code: 'TOYJOY10',
      description: 'Get 10% OFF on all toys',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscount: 300,
      isActive: true,
    },
    {
      code: 'FLAT100',
      description: 'Flat ₹100 OFF on orders above ₹699',
      discountType: 'FIXED',
      discountValue: 100,
      minOrderAmount: 699,
      maxDiscount: 100,
      isActive: true,
    },
    {
      code: 'FESTIVE20',
      description: 'Festive Special: 20% OFF on orders above ₹999',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 999,
      maxDiscount: 500,
      isActive: true,
    },
    {
      code: 'SUPERKID',
      description: 'Mega Deal: Flat ₹250 OFF on orders above ₹1499',
      discountType: 'FIXED',
      discountValue: 250,
      minOrderAmount: 1499,
      maxDiscount: 250,
      isActive: true,
    },
  ];

  for (const coup of couponsData) {
    await prisma.coupon.create({ data: coup });
  }
  console.log('Coupons seeded successfully');

  // Create Categories
  const categoriesData = [
    {
      name: 'Educational & STEM',
      slug: 'educational-stem',
      description: 'Science kits, building blocks, coding toys, and brain teasers for smart kids.',
      icon: 'GraduationCap',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
      color: '#06D6A0',
    },
    {
      name: 'Soft Toys & Plushies',
      slug: 'soft-toys-plushies',
      description: 'Ultra-soft, cuddly teddy bears, animal plushies, and sleepy companions.',
      icon: 'Heart',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
      color: '#F72585',
    },
    {
      name: 'RC Cars & Vehicles',
      slug: 'rc-cars-vehicles',
      description: 'High-speed remote control cars, monster trucks, drones, and train sets.',
      icon: 'Car',
      image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80',
      color: '#FF7844',
    },
    {
      name: 'Puzzles & Board Games',
      slug: 'puzzles-board-games',
      description: 'Family fun games, 3D jigsaw puzzles, strategy games, and card games.',
      icon: 'Puzzle',
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
      color: '#7209B7',
    },
    {
      name: 'Action Figures & Heroes',
      slug: 'action-figures-heroes',
      description: 'Superheroes, dinosaurs, anime collectibles, and adventure battle sets.',
      icon: 'Shield',
      image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=600&q=80',
      color: '#2EC4B6',
    },
    {
      name: 'Art, Craft & Clay',
      slug: 'art-craft-clay',
      description: 'Modeling clay, drawing tablets, DIY slime, and creative painting sets.',
      icon: 'Palette',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
      color: '#FFD23F',
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories.push(created);
  }

  // Create Products
  const productsData = [
    {
      title: 'Solar System Planetary STEM Explorer Kit',
      slug: 'solar-system-planetary-stem-kit',
      description: 'Engage young astronauts with motorized rotating planets and a built-in star projector! Teaches astronomy with interactive audio facts.',
      price: 1299,
      compareAtPrice: 1999,
      discount: 35,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      ]),
      videoUrl: 'https://www.youtube-nocookie.com/embed/libKVRa01L8',
      categorySlug: 'educational-stem',
      ageGroup: '6-8 Years',
      stock: 25,
      isFeatured: true,
      isTrending: true,
      isBestseller: true,
      rating: 4.9,
      reviewsCount: 48,
      safetyInfo: 'ASTM & EN71 Certified, Non-Toxic Paint, Child-Safe Edges',
      brand: 'CosmoKids',
      metaTitle: 'Buy Solar System STEM Explorer Kit Online India | ToyJoy COD',
      metaDescription: 'Motorized planetary model with star projector for kids 6-8 years. Learn astronomy, cash on delivery available across India.',
      metaKeywords: 'stem toys, planetary kit, astronomy for kids, solar system model cod',
    },
    {
      title: 'Giant 3-Foot Cuddle Teddy Bear',
      slug: 'giant-3-foot-cuddle-teddy-bear',
      description: 'Super plush, hypoallergenic jumbo teddy bear with warm huggable velvet touch and washable fur. Perfect gift for birthdays and comforting sleep.',
      price: 899,
      compareAtPrice: 1499,
      discount: 40,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      ]),
      videoUrl: 'https://www.youtube-nocookie.com/embed/YyJmUfN_hVw',
      categorySlug: 'soft-toys-plushies',
      ageGroup: '0-2 Years',
      stock: 40,
      isFeatured: true,
      isTrending: true,
      isBestseller: true,
      rating: 4.8,
      reviewsCount: 65,
      safetyInfo: '100% Recycled Cotton Filling, Hypoallergenic, Safe for Newborns',
      brand: 'HuggyBuddy',
      metaTitle: 'Buy Jumbo 3-Foot Cuddle Teddy Bear Online (COD) | ToyJoy India',
      metaDescription: 'Super soft, 100% hypoallergenic velvety teddy bear for kids and toddlers. Cash on Delivery and easy returns.',
      metaKeywords: 'teddy bear, giant soft toy, plush teddy, buy soft toys online cod',
    },
    {
      title: 'Monster All-Terrain 4WD RC Stunt Car (360° Flip)',
      slug: 'monster-all-terrain-4wd-rc-stunt-car',
      description: 'Double-sided driving, 360-degree high-speed rotation, bright LED headlights, and 2.4GHz anti-interference remote with 50m range.',
      price: 1599,
      compareAtPrice: 2499,
      discount: 36,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80',
      ]),
      videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      categorySlug: 'rc-cars-vehicles',
      ageGroup: '6-8 Years',
      stock: 18,
      isFeatured: true,
      isTrending: true,
      isBestseller: false,
      rating: 4.7,
      reviewsCount: 32,
      safetyInfo: 'Shock-resistant ABS Body, Rechargeable USB Battery Pack',
      brand: 'NitroSpeed',
      metaTitle: 'Buy 4WD High-Speed Stunt RC Car Online India - Cash on Delivery',
      metaDescription: '360 flip rotating double-sided monster stunt remote control car for boys & girls. Fast delivery & COD in India.',
      metaKeywords: 'rc stunt car, remote control car, 4wd toy car, buy rc car cod',
    },
    {
      title: 'Magnetic 3D Marble Run Building Blocks (120 Pcs)',
      slug: 'magnetic-3d-marble-run-building-blocks',
      description: 'Luminous light-up marbles speed through transparent tubes and magnetic geometric tiles. Boosts creativity, engineering mindset and spatial IQ.',
      price: 1899,
      compareAtPrice: 2999,
      discount: 37,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80',
      ]),
      categorySlug: 'educational-stem',
      ageGroup: '3-5 Years',
      stock: 30,
      isFeatured: true,
      isTrending: true,
      isBestseller: true,
      rating: 4.9,
      reviewsCount: 92,
      safetyInfo: 'Reinforced Ultrasonic Welding, Strong Rare-Earth Magnets Sealed Inside',
      brand: 'MagnaPlay',
    },
    {
      title: 'World Map Wooden Jigsaw Puzzle (1000 Pcs with Flags)',
      slug: 'world-map-wooden-jigsaw-puzzle',
      description: 'Vibrant geography puzzle featuring landmarks, wildlife, cultural monuments, and country flags. Made of premium eco-friendly laser-cut wood.',
      price: 749,
      compareAtPrice: 1199,
      discount: 38,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      ]),
      categorySlug: 'puzzles-board-games',
      ageGroup: '9+ Years',
      stock: 22,
      isFeatured: false,
      isTrending: true,
      isBestseller: false,
      rating: 4.6,
      reviewsCount: 28,
      safetyInfo: 'Smooth-sanded Birch Wood, Organic Soy Ink',
      brand: 'BrainQuik',
    },
    {
      title: 'T-Rex Roaring Electronic Dinosaur Robot',
      slug: 't-rex-roaring-electronic-dinosaur-robot',
      description: 'Realistic walking Jurassic predator with breathing water mist smoke effect, glowing red eyes, and authentic thunderous sound effects.',
      price: 1399,
      compareAtPrice: 2199,
      discount: 36,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      ]),
      categorySlug: 'action-figures-heroes',
      ageGroup: '3-5 Years',
      stock: 14,
      isFeatured: true,
      isTrending: false,
      isBestseller: true,
      rating: 4.8,
      reviewsCount: 54,
      safetyInfo: 'Non-Toxic PVC, Smooth Claws, Safe for Toddler Play',
      brand: 'DinoRoar',
    },
    {
      title: '24-Color Magic Air-Dry Modeling Clay Studio',
      slug: 'magic-air-dry-clay-studio-kit',
      description: 'Super soft, mess-free, ultra-light modeling clay with sculpting tools, jewelry accessories, and tutorials. Dries naturally in 24 hours without baking.',
      price: 499,
      compareAtPrice: 799,
      discount: 37,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      ]),
      categorySlug: 'art-craft-clay',
      ageGroup: '3-5 Years',
      stock: 50,
      isFeatured: false,
      isTrending: true,
      isBestseller: true,
      rating: 4.9,
      reviewsCount: 110,
      safetyInfo: 'Gluten-Free, Odorless, Zero Mess, Washable from Hands and Fabric',
      brand: 'ClayCraze',
    },
    {
      title: 'Baby Musical Walker & Activity Play Center',
      slug: 'baby-musical-walker-activity-center',
      description: 'Sit-to-stand early learning activity walker with piano keys, shape sorters, spinning gears, and speed-control wheels to support first steps.',
      price: 2199,
      compareAtPrice: 3499,
      discount: 37,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      ]),
      categorySlug: 'educational-stem',
      ageGroup: '0-2 Years',
      stock: 12,
      isFeatured: true,
      isTrending: true,
      isBestseller: false,
      rating: 4.9,
      reviewsCount: 38,
      safetyInfo: 'Anti-Tip Triangular Structure, Smooth Edges, BPA-Free Food Grade Plastic',
      brand: 'TinySteps',
    },
  ];

  for (const prod of productsData) {
    const matchedCategory = categories.find((c) => c.slug === prod.categorySlug);
    if (!matchedCategory) continue;

    const { categorySlug, ...rest } = prod;
    await prisma.product.create({
      data: {
        ...rest,
        categoryId: matchedCategory.id,
      },
    });
  }

  // Create Sample Order linked to customerUser
  await prisma.order.create({
    data: {
      orderNumber: 'TOY-89214',
      userId: customerUser.id,
      customerName: customerUser.name,
      email: customerUser.email,
      phone: customerUser.phone || '9876543210',
      address: 'Flat 402, Sunshine Heights, MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      paymentMethod: 'COD',
      subtotal: 2198,
      shippingFee: 0,
      couponCode: 'TOYJOY10',
      couponDiscount: 219.8,
      totalAmount: 1978.2,
      status: 'PENDING',
      notes: 'Please ring the bell twice, child sleeping in the afternoon.',
      items: {
        create: [
          {
            title: 'Solar System Planetary STEM Explorer Kit',
            price: 1299,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
          },
          {
            title: 'Giant 3-Foot Cuddle Teddy Bear',
            price: 899,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
    },
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
