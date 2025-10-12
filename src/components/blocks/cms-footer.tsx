import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FooterData } from '@/lib/navigation';

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <Link 
    href={href} 
    className="text-content-inverse hover:text-content-muted transition-colors no-underline hover:no-underline"
  >
    {children}
  </Link>
)

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-content-inverse">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <FooterLink href={link.href}>{link.label}</FooterLink>
        </li>
      ))}
    </ul>
  </div>
)

interface CMSFooterProps {
  footerData: FooterData;
}

export function CMSFooter({ footerData }: CMSFooterProps) {
  return (
    <footer className="bg-surface-primary py-12 md:py-16">
      <div className="container-nav">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and company info */}
          <div className="lg:col-span-2 space-y-6">
            {footerData.logo ? (
              <Image 
                src={footerData.logo.url} 
                alt={footerData.logo.alt || "Logo"} 
                width={0} 
                height={0} 
                style={{ width: 'auto', height: 'auto' }}
                className="" 
              />
            ) : (
              <Image
                src="/xflo_logo_new2025.svg"
                alt="xFlo Logo"
                width={73}
                height={20}
                style={{ width: '73px', height: 'auto' }}
                className="filter brightness-0 invert"
              />
            )}
            <p className="text-content-inverse max-w-sm leading-relaxed">
              The AI platform that transforms your data, automates your workflows, and scales your business.
            </p>
          </div>
          
          {/* Navigation columns */}
          {footerData.columns.map((column) => (
            <FooterColumn 
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
        </div>
        
        <div className="h-px w-full bg-content-inverse/20 my-8 md:my-10" />
        
        {/* Bottom section with copyright and social links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-content-inverse">
            © {new Date().getFullYear()} {footerData.copyrightText}
          </p>
          
          <div className="flex items-center gap-6">
            {footerData.socialLinks.twitter && (
              <Link href={footerData.socialLinks.twitter} className="text-content-inverse hover:text-content-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
            )}
            {footerData.socialLinks.linkedin && (
              <Link href={footerData.socialLinks.linkedin} className="text-content-inverse hover:text-content-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            )}
            {footerData.socialLinks.facebook && (
              <Link href={footerData.socialLinks.facebook} className="text-content-inverse hover:text-content-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
            )}
            {footerData.socialLinks.instagram && (
              <Link href={footerData.socialLinks.instagram} className="text-content-inverse hover:text-content-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}