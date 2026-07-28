import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { baseOptions } from '@/lib/layout.shared';
import { cn } from '@/lib/cn';

// Loaded here rather than in the root layout so the docs pages keep Inter.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div
      className={cn(
        bricolage.variable,
        plexSans.variable,
        plexMono.variable,
        'pb-home font-body flex flex-1 flex-col',
      )}
    >
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
    </div>
  );
}
