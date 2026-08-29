import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultTheme = {
  id: 'global',
  fontFamily: 'Plus Jakarta Sans',
  primaryColor: '#FF7844',
  secondaryColor: '#2EC4B6',
  buttonStyle: 'bouncy-3d',
  borderRadius: 'rounded-3xl',
  festiveMode: 'NONE',
  festiveBadgeText: 'Festive Mega Toy Sale • Up to 50% OFF',
  festiveLogoEmoji: '🪔',
  festiveLogoUrl: null,
  festiveBannerActive: true,
  festiveRibbonBg: 'from-amber-600 via-rose-600 to-purple-600',
};

// GET active store theme and festive campaign settings
export async function GET() {
  try {
    let theme = await prisma.storeTheme.findUnique({
      where: { id: 'global' },
    });

    if (!theme) {
      try {
        theme = await prisma.storeTheme.create({
          data: defaultTheme,
        });
      } catch {
        theme = defaultTheme as any;
      }
    }

    return NextResponse.json(theme || defaultTheme);
  } catch (error) {
    console.error('Error fetching theme, returning default:', error);
    return NextResponse.json(defaultTheme);
  }
}

// PUT update store theme
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fontFamily,
      primaryColor,
      secondaryColor,
      buttonStyle,
      borderRadius,
      festiveMode,
      festiveBadgeText,
      festiveLogoEmoji,
      festiveLogoUrl,
      festiveBannerActive,
      festiveRibbonBg,
    } = body;

    const updated = await prisma.storeTheme.upsert({
      where: { id: 'global' },
      update: {
        fontFamily: fontFamily || undefined,
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        buttonStyle: buttonStyle || undefined,
        borderRadius: borderRadius || undefined,
        festiveMode: festiveMode !== undefined ? festiveMode : undefined,
        festiveBadgeText: festiveBadgeText !== undefined ? festiveBadgeText : undefined,
        festiveLogoEmoji: festiveLogoEmoji !== undefined ? festiveLogoEmoji : undefined,
        festiveLogoUrl: festiveLogoUrl !== undefined ? festiveLogoUrl : undefined,
        festiveBannerActive: festiveBannerActive !== undefined ? Boolean(festiveBannerActive) : undefined,
        festiveRibbonBg: festiveRibbonBg || undefined,
      },
      create: {
        id: 'global',
        fontFamily: fontFamily || 'Plus Jakarta Sans',
        primaryColor: primaryColor || '#FF7844',
        secondaryColor: secondaryColor || '#2EC4B6',
        buttonStyle: buttonStyle || 'bouncy-3d',
        borderRadius: borderRadius || 'rounded-3xl',
        festiveMode: festiveMode || 'NONE',
        festiveBadgeText: festiveBadgeText || 'Festive Mega Toy Sale • Up to 50% OFF',
        festiveLogoEmoji: festiveLogoEmoji || '🪔',
        festiveLogoUrl: festiveLogoUrl || null,
        festiveBannerActive: festiveBannerActive !== undefined ? Boolean(festiveBannerActive) : true,
        festiveRibbonBg: festiveRibbonBg || 'from-amber-600 via-rose-600 to-purple-600',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update store theme' }, { status: 500 });
  }
}
