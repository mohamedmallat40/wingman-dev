import { Button } from '@heroui/button';
import { ArrowRight } from 'lucide-react';

import FadeInImage from '@/components/fade-in-image';

const page = () => {
  return (
    <>
      <section className='mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 px-4 py-6'>
        {/* Main Headline */}
        <div className='text-center'>
          <h1 className='mb-3 text-4xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            Vind binnen 2 dagen <span className='text-red-400'>gescreende digitale experts</span> en
            zet digitale uitdagingen om in groeikansen
          </h1>
        </div>

        {/* Subtitle */}
        <p className='text-default-500 max-w-3xl text-center text-lg leading-relaxed'>
          Van e-commerce pieken, marketing automation of het verhogen van jullie ROI via social
          media – uw persoonlijke Success Manager matcht u met 650+ flexibele, vooraf gescreende,
          beschikbare freelancers uit de Benelux
        </p>

        {/* Statistics */}
        <div className='my-8 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-20'>
          <div className='text-center'>
            <div className='mb-2 text-4xl font-bold text-red-400 lg:text-5xl'>48u</div>
            <div className='text-sm text-gray-600 lg:text-base'>Shortlist klaar</div>
          </div>
          <div className='text-center'>
            <div className='mb-2 text-4xl font-bold text-red-400 lg:text-5xl'>+85%</div>
            <div className='text-sm text-gray-600 lg:text-base'>Tevredenheid</div>
          </div>
          <div className='text-center'>
            <div className='mb-2 text-4xl font-bold text-red-400 lg:text-5xl'>90%</div>
            <div className='text-sm text-gray-600 lg:text-base'>Match succes</div>
          </div>
          <div className='text-center'>
            <div className='mb-2 text-4xl font-bold text-red-400 lg:text-5xl'>650+</div>
            <div className='text-sm text-gray-600 lg:text-base'>Gescreende experts</div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button className='min-w-[200px] rounded-full bg-red-500 px-8 py-3 text-base font-medium text-white hover:bg-red-600'>
            Boek gratis strategiesessie
          </Button>
          <Button
            variant='bordered'
            className='flex min-w-[200px] items-center gap-2 rounded-full border-red-500 px-8 py-3 text-base font-medium text-red-400 hover:bg-red-50'
          >
            Bekijk talentpool
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </section>

      {/* Background Gradient */}
      <div className='pointer-events-none absolute inset-0 top-[-25%] z-[-1] scale-150 select-none sm:scale-125'>
        <FadeInImage
          alt='Gradient background'
          src='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/backgrounds/bg-gradient.png'
        />
      </div>
    </>
  );
};

export default page;
