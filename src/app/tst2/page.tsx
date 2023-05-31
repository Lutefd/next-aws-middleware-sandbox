import { Suspense } from 'react';
import Loading from '@/app/loading';
import Users from '@/components/Users';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports, ssr: true });

async function Home() {
  // const getData = async () => {
  //   const res = await fetch('http://localhost:3000/api/users/', {
  //     next: {
  //       revalidate: 0,
  //     },
  //   });
  //   const data = await res.json();
  //   return data.results;
  // };
  // const data = await getData();
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //     <Suspense fallback={<Loading />}>
  //       <Users data={data} />
  //     </Suspense>
  //   </main>
  // );
}

export default Home;
