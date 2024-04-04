import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { montserrat } from '../ui/fonts';
import NavBar from './components/NavBar/Navbar';
import Footer from './components/Footer';
import {I18nProviderClient} from '../../locales/client';
import {ReactElement} from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wetube',
  description: 'Wetube',
}

export default function RootLayout({
  params:{locale},
  children,
}: {
  params:{locale:string},
  children: ReactElement
}) {
  return (
      <html lang="en" data-theme='lemonade'>
        <body className={`${inter.className}+' '+${montserrat.className} antialiased`}>
        <I18nProviderClient locale={locale}>
          <header>
            <NavBar/>
          </header>
          <div className='flex flex-col min-h-[calc(100vh-8rem)]'>
            {children}
          </div>
          <Footer/>
          </I18nProviderClient>
        </body>
      </html>
  )
}
