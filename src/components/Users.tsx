'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';
import Button from './Button';

Amplify.configure({ ...awsExports, ssr: true });
interface st {
  data: [];
}
function Users({ data }: st) {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  async function handleChange() {
    startTransition(() => {
      router.refresh();
      setCount(count + 1);
    });
  }

  if (isPending) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center">
      {data.map((user: any) => (
        <div
          key={user.id.value || user.id.name}
          className="flex flex-col items-center justify-center"
        >
          <Image src={user.picture.large} alt="user" width={200} height={200} />
          <p className="text-2xl font-bold">
            {user.name.first} {user.name.last}
          </p>
          <p className="text-xl">{user.email}</p>
          <p className="text-xl">{user.phone}</p>
          <p className="text-xl">{user.location.city}</p>
        </div>
      ))}
      <Button count={count} handleChange={handleChange} />
    </div>
  );
}

export default Users;
