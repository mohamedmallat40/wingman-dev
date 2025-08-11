import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import ProfileClient from './components/ProfileClient';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Profile | Wingman',
  description: 'View user profile details'
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  return <ProfileClient userId={id} />;
}
