'use client';

import { Divider } from '@heroui/divider';
import { Link } from '@heroui/link';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { LoginModal } from '@/app/(public)/components/login';
import { WingmanIcon } from '@/components/icons/wingman';
import { useSmartNavigation } from '@/hooks/use-smart-navigation';

const footerLinks = {
  product: [
    { label: 'Talent Pool', href: '/private/talent-pool', requiresAuth: true },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'API', href: '/api' }
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Support', href: '/support' },
    { label: 'Status', href: '/status' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' }
  ]
};

const socialLinks = [
  {
    icon: 'solar:linkedin-outline',
    href: 'https://linkedin.com/company/wingman-dev',
    label: 'LinkedIn'
  },
  { icon: 'solar:twitter-outline', href: 'https://twitter.com/wingmandev', label: 'Twitter' },
  { icon: 'solar:github-outline', href: 'https://github.com/wingman-dev', label: 'GitHub' },
  { icon: 'solar:mail-outline', href: 'mailto:hello@wingman.dev', label: 'Email' }
];

export default function Footer() {
  const t = useTranslations('landing.footer');
  const { navigateToPrivate, navigateToPublic, loginModal } = useSmartNavigation();

  const handleLinkClick = (link: { href: string; requiresAuth?: boolean }) => {
    if (link.requiresAuth) {
      navigateToPrivate(link.href);
    } else {
      navigateToPublic(link.href);
    }
  };

  return (
    <footer className='dark:bg-background/10 border-default-200/50 relative z-10 border-t bg-white/10 backdrop-blur-xl'>
      <div className='mx-auto max-w-7xl px-6 py-16'>
        {/* Main Footer Content */}
        <div className='grid gap-8 lg:grid-cols-5'>
          {/* Brand Column */}
          <div className='lg:col-span-2'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-[12px]'>
                <WingmanIcon />
              </div>
              <div>
                <p className='text-foreground text-lg font-bold tracking-[0.15em]'>WINGMAN</p>
                <p className='text-default-500 text-xs font-medium tracking-[0.1em]'>
                  BY EXTRAEXPERTISE
                </p>
              </div>
            </div>
            <p className='text-default-600 mb-6 max-w-md leading-relaxed'>{t('description')}</p>

            {/* Social Links */}
            <div className='flex items-center gap-4'>
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  isExternal
                  className='text-default-500 hover:text-primary transition-colors duration-200'
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} className='h-5 w-5' />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className='text-foreground mb-4 font-semibold tracking-[0.02em]'>{t('product')}</h3>
            <ul className='space-y-3'>
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    as='button'
                    onPress={() => handleLinkClick(link)}
                    className='text-default-600 hover:text-primary cursor-pointer text-sm transition-colors duration-200'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-foreground mb-4 font-semibold tracking-[0.02em]'>{t('company')}</h3>
            <ul className='space-y-3'>
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-default-600 hover:text-primary text-sm transition-colors duration-200'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-foreground mb-4 font-semibold tracking-[0.02em]'>{t('support')}</h3>
            <ul className='space-y-3'>
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-default-600 hover:text-primary text-sm transition-colors duration-200'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className='mt-6'>
              <h4 className='text-foreground mb-3 text-sm font-semibold tracking-[0.02em]'>
                {t('legal')}
              </h4>
              <ul className='space-y-2'>
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-default-600 hover:text-primary text-xs transition-colors duration-200'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Divider className='bg-default-200 my-8' />

        {/* Bottom Bar */}
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <p className='text-default-500 text-sm'>
            © {new Date().getFullYear()} Wingman by ExtraExpertise. {t('allRightsReserved')}
          </p>
          <div className='text-default-500 flex items-center gap-6 text-xs'>
            <Link href='/privacy' className='hover:text-primary transition-colors duration-200'>
              Privacy
            </Link>
            <Link href='/terms' className='hover:text-primary transition-colors duration-200'>
              Terms
            </Link>
            <Link href='/cookies' className='hover:text-primary transition-colors duration-200'>
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Login Modal for unauthenticated users */}
      <LoginModal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
        onSwitchToRegister={() => {
          loginModal.onClose();
          navigateToPublic('/register');
        }}
      />
    </footer>
  );
}
