import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tweets',
  description: 'Quick thoughts, random musings, unfiltered.',
};

export default function TweetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
