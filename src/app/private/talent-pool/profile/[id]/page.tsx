import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import ProfileClient from './components/ProfileClient';

interface ProfilePageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Profile | Talent Pool',
  description: 'View talent profile details'
};

export default function ProfilePage({ params }: ProfilePageProps) {
  if (!params.id) {
    notFound();
  }

  return <ProfileClient userId={params.id} />;
}
