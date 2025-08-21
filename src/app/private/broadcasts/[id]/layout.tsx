import type { BroadcastPost } from '../types';

import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

async function getPostById(postId: string): Promise<BroadcastPost | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/broadcast/${postId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Ensure fresh data for social media crawlers
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    return (await response.json()) as BroadcastPost;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return {
        title: 'Broadcast Not Found - Wingman',
        description: 'The requested broadcast could not be found.'
      };
    }

    const title = post.title || 'Wingman Broadcast';
    const description = post.description || 'Check out this broadcast on Wingman';
    const author = `${post.owner?.firstName || ''} ${post.owner?.lastName || ''}`.trim();
    const imageUrl = post.attachments?.[0]
      ? `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${post.attachments[0]}`
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/images/wingman-og-default.jpg`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/private/broadcasts/${id}`;

    return {
      title: `${title} - Wingman`,
      description: description.length > 160 ? `${description.substring(0, 157)}...` : description,
      authors: [{ name: author }],
      robots: {
        index: true,
        follow: true
      },
      openGraph: {
        title: `${title} - Wingman`,
        description: description.length > 160 ? `${description.substring(0, 157)}...` : description,
        url: url,
        siteName: 'Wingman',
        type: 'article',
        publishedTime: post.createdAt,
        authors: [author],
        tags: post.topics?.map((topic) => topic.title) || [],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg'
          }
        ],
        locale: 'en_US'
      },
      twitter: {
        card: post.attachments?.[0] ? 'summary_large_image' : 'summary',
        title: `${title} - Wingman`,
        description: description.length > 160 ? `${description.substring(0, 157)}...` : description,
        images: post.attachments?.[0] ? [imageUrl] : undefined
      },
      alternates: {
        canonical: url
      },
      other: {
        'article:published_time': post.createdAt,
        'article:author': author,
        'article:section': 'Broadcasts',
        'article:tag': post.topics?.map((topic) => topic.title).join(', ') || 'Wingman',
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:type': 'image/jpeg',
        'twitter:image:width': '1200',
        'twitter:image:height': '630'
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Wingman Broadcast',
      description: 'Professional networking and content sharing platform'
    };
  }
}

export default function BroadcastDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
