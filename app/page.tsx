import { LandingPage } from '@/components/LandingPage';
import { fetchLatestDesktopRelease } from '@/lib/fetchRelease';

export const revalidate = 300;

export default async function Home() {
  const release = await fetchLatestDesktopRelease();
  return <LandingPage release={release} />;
}
