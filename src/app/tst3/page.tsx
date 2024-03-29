import { Suspense } from 'react';
import Loading from '@/app/loading';
import LoginFormT from '@/components/LoginFormT';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports, ssr: true });
async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<Loading />}>
        <LoginFormT />
      </Suspense>
    </main>
  );
}

export default Home;
