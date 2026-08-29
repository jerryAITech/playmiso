import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #FFD23F 0%, #FF7844 50%, #F72585 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: '1.5px solid white',
          boxShadow: '0 2px 8px rgba(255, 120, 68, 0.4)',
        }}
      >
        🎲
      </div>
    ),
    {
      ...size,
    }
  );
}
