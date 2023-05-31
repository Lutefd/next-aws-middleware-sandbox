import Numbers from '@/components/Numbers';
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports, ssr: true });

export default async function Page() {
  const getData = async () => {
    const res = await fetch('http://localhost:3000/api/random/', {
      next: {
        revalidate: 0,
      },
    });
    const data = await res.json();
    return data.random;
  };
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Numbers data={data} />
    </main>
  );
}
