'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';
import Button from './Button';

Amplify.configure({ ...awsExports, ssr: true });
export default function Numbers({ data }: any) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handleChange() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-2xl font-bold">{data}</p>
      <Button handleChange={handleChange} />
    </div>
  );
}
