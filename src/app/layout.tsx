
import "./globals.css";
import { ClusterProvider } from "@/components/cluster/cluster-data-access";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { Layout } from "@/components/ui/layouts/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ui/layouts/theme-provider";
import { ReduxProvider } from "./redux-provider";

export const metadata = {
  title: 'WiniSol - Decentralized Solana Lottery Platform',
  description: 'WiniSol: Transparent, decentralized lottery on Solana with provably fair draws and instant blockchain payouts. Join the most trusted crypto lottery system today.',
  image: 'https://winisol.com/logo.png',
  url: 'https://winisol.com',
  twitter: {
    handle: '@winisol_',
    site: '@winisol_',
  },
  icons: {
    icon: "/favicon.ico", 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href={metadata.icons.icon} sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="canonical" href="https://winisol.com" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="Solana lottery, decentralized lottery, blockchain lottery, WiniSol, crypto lottery, provably fair draws, transparent blockchain gaming, Solana dApp, instant blockchain payouts, crypto gambling, fair crypto draws, win SOL tokens, decentralized gaming platform, Solana gaming" />
        <meta name="author" content="WiniSol" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="theme-color" content="#000000" />
        
        {/* Open Graph (for social media sharing) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:site_name" content="WiniSol" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:creator" content={metadata.twitter.handle} />

        {/* Preconnects & Icons */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/site.webmanifest" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "WiniSol",
              "url": "https://winisol.com",
              "logo": "https://winisol.com/logo.png",
              "description": "WiniSol is a decentralized lottery platform built on Solana. Play, win, and experience true decentralization with provably fair draws.",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Web-based",
              "offers": {
                "@type": "Offer",
                "category": "Decentralized Gaming"
              },
              "sameAs": [
                "https://twitter.com/winisol_",
                "https://t.me/winisol"
              ]
            }),
          }}
        />
      </head>
      
      <body>
        <ReduxProvider>
          <ReactQueryProvider>
            <ClusterProvider>
              <SolanaProvider>
                <AuthProvider>    
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                  >           
                    <Layout>{children}</Layout>  
                  </ThemeProvider>
                </AuthProvider>
              </SolanaProvider>
            </ClusterProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
