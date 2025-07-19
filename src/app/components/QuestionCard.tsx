interface Question {
  difficulty: string;
  question: string;
  frequency: number;
  link: string;
  companies: string;
  topics: string;
}

export default function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <a
        href={question.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xl font-semibold"
        style={{ color: 'rgb(7, 81, 207)' }}
      >
        {question.question}
      </a>
      <p className="text-black mt-1">
        <strong>Difficulty:</strong> {question.difficulty}
      </p>
      <p className="text-black">
        <strong>Topics:</strong> {question.topics}
      </p>
      <p className="text-black">
        <strong>Companies:</strong> {question.companies.split(',').slice(0, 5).join(', ')}...
      </p>
      <p className="text-black">
        <strong>Frequency:</strong> {question.frequency}
      </p>
    </div>
  );
}
