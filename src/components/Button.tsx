'use client';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports, ssr: true });

interface st {
  count?: number;
  handleChange: () => void;
}
function Button({ count, handleChange }: st) {
  return (
    <button
      type="button"
      onClick={() => {
        handleChange();
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      refetch data {count}
    </button>
  );
}

export default Button;
