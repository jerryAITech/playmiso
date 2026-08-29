import { NextResponse } from 'next/server';

export async function GET() {
  const headers = [
    'Title',
    'Category',
    'Price (INR)',
    'Compare At Price (MRP)',
    'Discount (%)',
    'Stock',
    'Age Group',
    'Brand',
    'Description',
    'Safety Info',
    'Image URLs (Comma-separated)',
    'Demo Video URL',
    'Meta Title',
    'Meta Description',
    'Meta Keywords',
    'Is Featured',
    'Is Trending',
    'Is Bestseller',
  ];

  const sampleRows = [
    [
      '"Interactive Dancing Robot Toy with Lights & Music"',
      '"Educational & STEM Kits"',
      '999',
      '1499',
      '33',
      '30',
      '"3-5 Years"',
      '"PlayMiso"',
      '"Smart interactive dancing robot with 360 degree spin, colorful LED laser lights, and catchy musical tunes for toddlers and kids."',
      '"100% Non-Toxic ABS plastic, BPA Free, Safe rounded corners"',
      '"https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80, https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"',
      '"https://www.youtube-nocookie.com/embed/libKVRa01L8"',
      '"Buy Interactive Dancing Robot Toy Online in India | PlayMiso COD"',
      '"Shop smart dancing robot with 360 spin & lights at ₹999 with Cash on Delivery across India."',
      '"robot toy, dancing robot, toys for 3 year old, cod toys"',
      '"TRUE"',
      '"TRUE"',
      '"TRUE"',
    ],
    [
      '"Super Speed Drift RC Stunt Car 4WD"',
      '"Remote Control & RC Cars"',
      '1299',
      '1999',
      '35',
      '25',
      '"6-8 Years"',
      '"NitroSpeed"',
      '"High-speed 4WD remote control car with 360 flip stunts, shock absorbers, rechargeable battery and 50m remote control range."',
      '"Shock-resistant body, USB rechargeable battery pack included"',
      '"https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80"',
      '"https://www.youtube-nocookie.com/embed/ScMzIvxBSi4"',
      '"Buy 4WD High Speed Stunt RC Car Online India - Cash on Delivery"',
      '"Double sided rotating stunt RC car for kids with LED lights and 2.4GHz remote control."',
      '"rc car, stunt car, remote control car, boys toys"',
      '"TRUE"',
      '"TRUE"',
      '"FALSE"',
    ],
    [
      '"Soft Velvet Jumbo Sleeping Elephant Plushie"',
      '"Soft Toys & Plushies"',
      '799',
      '1299',
      '38',
      '40',
      '"0-2 Years"',
      '"HuggyBuddy"',
      '"Ultra soft, hypoallergenic plush elephant pillow for babies and toddlers. Perfect companion for restful sleep and cozy hugs."',
      '"100% Recycled Cotton Filling, Safe for Newborns"',
      '"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80"',
      '""',
      '"Buy Jumbo Elephant Soft Toy Online India (COD Available) | PlayMiso"',
      '"Super soft velvety elephant plushie for newborn babies and toddlers."',
      '"elephant plushie, soft toy, baby toys, teddy bear"',
      '"FALSE"',
      '"TRUE"',
      '"TRUE"',
    ],
  ];

  const csvContent =
    '\uFEFF' +
    [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\r\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="playmiso_products_sample_template.csv"',
    },
  });
}
