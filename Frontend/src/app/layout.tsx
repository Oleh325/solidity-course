import Head from 'next/head';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Head>
            <title>smartRaffle</title>
            <meta name="description" content="smartRaffle Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
      {children}
    </>
  );
}