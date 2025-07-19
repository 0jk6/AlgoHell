'use client';

import dynamic from 'next/dynamic';

const QuestionTable = dynamic(() => import('./components/QuestionTable'), { ssr: false });

export default function Home() {
  return (
    <main className="p-4">

      <h1 className="text-3xl font-bold mb-6" style={{ color: 'rgb(7, 81, 207)' }}>
        AlgoHell
      </h1>
      <QuestionTable />
    </main>
  );
}
