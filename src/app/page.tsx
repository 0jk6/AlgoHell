'use client';

import dynamic from 'next/dynamic';
import { Analytics } from "@vercel/analytics/next"
const QuestionTable = dynamic(() => import('./components/QuestionTable'), { ssr: false });

export default function Home() {
  return (
    <main className="p-4">
      {/* <h1 className="text-3xl font-bold mb-6 text-center text-[rgb(7,81,207)]">
        AlgoHell
      </h1> */}
      <QuestionTable />
      <Analytics />
    </main>
  );
}
