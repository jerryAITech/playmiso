import React from 'react';

export default function JsonLdSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://playmiso.vercel.app/#organization',
        name: 'PlayMiso',
        url: 'https://playmiso.vercel.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://playmiso.vercel.app/icon',
          caption: 'PlayMiso Toys India',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-98765-43210',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
        sameAs: [
          'https://instagram.com/playmiso',
          'https://facebook.com/playmiso',
          'https://youtube.com/playmiso',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://playmiso.vercel.app/#website',
        url: 'https://playmiso.vercel.app',
        name: 'PlayMiso Toys',
        description: 'Discover the Magic of Play. Safe, educational STEM kits, plushies, RC cars with Cash on Delivery across India.',
        publisher: {
          '@id': 'https://playmiso.vercel.app/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://playmiso.vercel.app/shop?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
