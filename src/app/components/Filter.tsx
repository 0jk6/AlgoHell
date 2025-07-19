interface FilterProps {
  selectedCompany: string;
  selectedDifficulty: string;
  onCompanyChange: (val: string) => void;
  onDifficultyChange: (val: string) => void;
}

export default function Filter({
  selectedCompany,
  selectedDifficulty,
  onCompanyChange,
  onDifficultyChange,
}: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Filter by company (e.g. Google)"
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
      />

      <select
        value={selectedDifficulty}
        onChange={(e) => onDifficultyChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full sm:w-1/4"
      >
        <option value="">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
    </div>
  );
}
