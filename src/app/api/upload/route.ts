import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mediaType = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate video duration / size if video
    if (mediaType === 'video' || file.type.startsWith('video/')) {
      const maxVideoSizeBytes = 50 * 1024 * 1024; // 50MB
      if (file.size > maxVideoSizeBytes) {
        return NextResponse.json(
          { error: 'Video file too large. Max allowed is 50MB (max 30 seconds).' },
          { status: 400 }
        );
      }
    }

    // Generate unique safe filename
    const ext = path.extname(file.name) || (file.type.startsWith('video/') ? '.mp4' : '.jpg');
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
      } catch {}
    }

    const filePath = path.join(uploadsDir, safeName);
    
    try {
      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: safeName,
        size: file.size,
        type: file.type,
      });
    } catch (fsError) {
      // In serverless read-only environments (Vercel), return a Base64 data URL fallback
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        filename: safeName,
        size: file.size,
        type: file.type,
        isBase64: true,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
