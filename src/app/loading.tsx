import { Spinner } from '@heroui/spinner';

export default function Loading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <Spinner variant='dots' size='lg' />
    </div>
  );
}
