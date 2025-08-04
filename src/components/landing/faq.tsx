'use client';

import React from 'react';

import { Card, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// FAQ data
const faqData = [
  {
    question: 'How quickly can I find talent?',
    answer:
      'Our team provides a shortlist of qualified candidates within 48 hours of your project submission.'
  },
  {
    question: 'What is the screening process?',
    answer:
      'All freelancers undergo rigorous vetting including technical assessments, portfolio reviews, and background checks.'
  },
  {
    question: 'Do you offer ongoing support?',
    answer:
      'Yes, each client gets a dedicated Success Manager who guides you through the entire process and ensures project success.'
  },
  {
    question: "What if I'm not satisfied with a match?",
    answer:
      "We offer a satisfaction guarantee. If you're not happy with a match, we'll provide alternative candidates at no extra cost."
  },
  {
    question: 'Can I hire for long-term projects?',
    answer:
      'Absolutely! Our freelancers are available for both short-term projects and long-term engagements.'
  }
];

export default function FAQ() {
  const t = useTranslations('landing.faq');
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  // FAQ Structured Data
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />
      <section id='faq' className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <h2 className='text-foreground mb-4 text-3xl font-bold tracking-[0.02em] lg:text-4xl'>
            {t('title')}
          </h2>
          <p className='text-default-600 text-lg'>{t('subtitle')}</p>
        </motion.header>

        <div className='space-y-4'>
          {faqData.map((faq, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <Card className='dark:bg-background/20 border-default-200/50 rounded-[16px] border bg-white/20 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)]'>
                <CardBody className='p-0'>
                  <button
                    className='hover:bg-default-50 flex w-full items-center justify-between rounded-[16px] p-6 text-left transition-colors duration-200'
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className='text-foreground pr-4 text-lg font-semibold'>{faq.question}</h3>
                    <Icon
                      icon='solar:alt-arrow-down-outline'
                      className={`text-default-400 h-5 w-5 transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                      aria-hidden='true'
                    />
                  </button>
                  {openFaq === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='px-6 pb-6'
                    >
                      <Divider className='mb-4' />
                      <p className='text-default-600 leading-relaxed'>{faq.answer}</p>
                    </motion.div>
                  )}
                </CardBody>
              </Card>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
