import { StatsProvider } from '@/app/context/StatsContext';

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StatsProvider>{children}</StatsProvider>;
}