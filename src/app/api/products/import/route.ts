import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Parse CSV text respecting quoted commas and linebreaks
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  // Clean BOM if present
  let cleanText = text;
  if (cleanText.charCodeAt(0) === 0xfeff) {
    cleanText = cleanText.slice(1);
  }

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // Skip CR in CRLF
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export async function POST(request: NextRequest) {
  try {
    const { csvContent } = await request.json();

    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json({ error: 'CSV content is required' }, { status: 400 });
    }

    const rows = parseCSV(csvContent);

    if (rows.length < 2) {
      return NextResponse.json(
        { error: 'CSV must contain at least a header row and 1 product row' },
        { status: 400 }
      );
    }

    const headerRow = rows[0].map((h) => h.toLowerCase().trim());
    const dataRows = rows.slice(1);

    // Map header names to indices
    const getIndex = (possibleNames: string[]) => {
      return headerRow.findIndex((h) => possibleNames.some((name) => h.includes(name)));
    };

    const titleIdx = getIndex(['title', 'product name', 'toy name']);
    const categoryIdx = getIndex(['category', 'cat']);
    const priceIdx = getIndex(['price', 'selling price']);
    const comparePriceIdx = getIndex(['compare at', 'mrp', 'original price']);
    const discountIdx = getIndex(['discount']);
    const stockIdx = getIndex(['stock', 'quantity', 'inventory']);
    const ageIdx = getIndex(['age group', 'age']);
    const brandIdx = getIndex(['brand']);
    const descIdx = getIndex(['description', 'desc', 'details']);
    const safetyIdx = getIndex(['safety', 'certification']);
    const imagesIdx = getIndex(['image', 'images', 'photos']);
    const videoIdx = getIndex(['video', 'video url', 'youtube']);
    const metaTitleIdx = getIndex(['meta title', 'seo title']);
    const metaDescIdx = getIndex(['meta description', 'seo description']);
    const metaKeywordsIdx = getIndex(['meta keywords', 'keywords', 'tags']);
    const isFeaturedIdx = getIndex(['featured']);
    const isTrendingIdx = getIndex(['trending']);
    const isBestsellerIdx = getIndex(['bestseller']);

    if (titleIdx === -1 || priceIdx === -1) {
      return NextResponse.json(
        { error: 'CSV must include at least "Title" and "Price" columns' },
        { status: 400 }
      );
    }

    // Cache categories
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map<string, string>();
    allCategories.forEach((c) => {
      categoryMap.set(c.name.toLowerCase(), c.id);
      categoryMap.set(c.slug.toLowerCase(), c.id);
    });

    const fallbackCategoryId = allCategories[0]?.id || 'cat_default';
    const importedProducts = [];
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2;

      const title = row[titleIdx];
      if (!title) {
        errors.push(`Row ${rowNum}: Skipped due to missing Title`);
        continue;
      }

      const priceStr = row[priceIdx];
      const price = parseFloat(priceStr?.replace(/[^0-9.]/g, '') || '0');
      if (price <= 0) {
        errors.push(`Row ${rowNum} (${title}): Invalid price "${priceStr}"`);
        continue;
      }

      // Match or Create Category
      const catName = (categoryIdx !== -1 ? row[categoryIdx] : '') || 'Educational & STEM Kits';
      let categoryId = categoryMap.get(catName.toLowerCase());

      if (!categoryId) {
        // Create new category dynamically
        const catSlug = catName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const newCat = await prisma.category.create({
          data: {
            name: catName,
            slug: catSlug || `cat-${Date.now()}`,
            description: `${catName} collection for kids`,
            icon: 'Sparkles',
            color: '#FF7844',
          },
        });
        categoryId = newCat.id;
        categoryMap.set(catName.toLowerCase(), categoryId);
      }

      const comparePriceStr = comparePriceIdx !== -1 ? row[comparePriceIdx] : '';
      const compareAtPrice = comparePriceStr
        ? parseFloat(comparePriceStr.replace(/[^0-9.]/g, ''))
        : null;

      let discount = discountIdx !== -1 ? parseInt(row[discountIdx]) || 0 : 0;
      if (compareAtPrice && compareAtPrice > price && discount === 0) {
        discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
      }

      const stockStr = stockIdx !== -1 ? row[stockIdx] : '20';
      const stock = parseInt(stockStr) || 20;

      const ageGroup = (ageIdx !== -1 ? row[ageIdx] : '') || '3-5 Years';
      const brand = (brandIdx !== -1 ? row[brandIdx] : '') || 'PlayMiso';
      const description = (descIdx !== -1 ? row[descIdx] : '') || `High quality ${title} for kids.`;
      const safetyInfo =
        (safetyIdx !== -1 ? row[safetyIdx] : '') ||
        '100% Non-Toxic, BPA Free, Child-Safe Rounded Corners';

      // Images parsing
      const rawImages = imagesIdx !== -1 ? row[imagesIdx] : '';
      let imagesArray = rawImages
        ? rawImages
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter((s) => s.startsWith('http'))
        : [];
      if (imagesArray.length === 0) {
        imagesArray = [
          'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
        ];
      }

      const videoUrl = (videoIdx !== -1 ? row[videoIdx] : '') || null;
      const metaTitle = (metaTitleIdx !== -1 ? row[metaTitleIdx] : '') || null;
      const metaDescription = (metaDescIdx !== -1 ? row[metaDescIdx] : '') || null;
      const metaKeywords = (metaKeywordsIdx !== -1 ? row[metaKeywordsIdx] : '') || null;

      const isFeatured = isFeaturedIdx !== -1 ? row[isFeaturedIdx]?.toUpperCase() === 'TRUE' : true;
      const isTrending = isTrendingIdx !== -1 ? row[isTrendingIdx]?.toUpperCase() === 'TRUE' : true;
      const isBestseller =
        isBestsellerIdx !== -1 ? row[isBestsellerIdx]?.toUpperCase() === 'TRUE' : false;

      // Unique slug
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const slug = `${baseSlug}-${randomSuffix}`;

      const created = await prisma.product.create({
        data: {
          title,
          slug,
          description,
          price,
          compareAtPrice,
          discount,
          stock,
          ageGroup,
          brand,
          safetyInfo,
          images: JSON.stringify(imagesArray),
          videoUrl,
          categoryId: categoryId || fallbackCategoryId,
          isFeatured,
          isTrending,
          isBestseller,
          metaTitle,
          metaDescription,
          metaKeywords,
          ogImage: imagesArray[0] || null,
        },
      });

      importedProducts.push(created);
    }

    return NextResponse.json({
      success: true,
      importedCount: importedProducts.length,
      errors,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Failed to import products' }, { status: 500 });
  }
}
