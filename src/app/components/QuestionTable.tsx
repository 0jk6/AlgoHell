'use client';

import { useState, useEffect } from 'react';
import questions from '../data/questions.json';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface Question {
    difficulty: string;
    question: string;
    frequency: number;
    link: string;
    companies: string;
    topics: string;
}

export default function QuestionTable() {
    const [completed, setCompleted] = useState<string[]>([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'difficulty' | 'frequency' | ''>('');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCompleted(JSON.parse(localStorage.getItem('completed') || '[]'));
            setSelectedCompany(localStorage.getItem('selectedCompany') || '');
            setSelectedTopic(localStorage.getItem('selectedTopic') || '');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('completed', JSON.stringify(completed));
    }, [completed]);

    useEffect(() => {
        localStorage.setItem('selectedCompany', selectedCompany);
        localStorage.setItem('selectedTopic', selectedTopic);
    }, [selectedCompany, selectedTopic]);

    const toggleComplete = (title: string) => {
        setCompleted(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const allCompanies = Array.from(
        new Set(questions.flatMap(q => q.companies.split(',').map(c => c.trim())))
    ).sort();

    const allTopics = Array.from(
        new Set(
            questions.flatMap(q =>
                q.topics.split(',').map(t => t.trim()).filter(t => t.length > 0)
            )
        )
    ).sort();

    const filtered = questions
        .filter(q => {
            const matchCompany = selectedCompany
                ? q.companies.toLowerCase().includes(selectedCompany.toLowerCase())
                : true;
            const matchTopic = selectedTopic
                ? q.topics.toLowerCase().includes(selectedTopic.toLowerCase())
                : true;
            const matchSearch = searchTerm
                ? q.question.toLowerCase().includes(searchTerm.toLowerCase())
                : true;
            return matchCompany && matchTopic && matchSearch;
        })
        .sort((a, b) => {
            if (!sortBy) return 0;
            if (sortBy === 'frequency') {
                return sortDir === 'asc' ? a.frequency - b.frequency : b.frequency - a.frequency;
            }
            const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
            return sortDir === 'asc'
                ? order[a.difficulty as keyof typeof order] - order[b.difficulty as keyof typeof order]
                : order[b.difficulty as keyof typeof order] - order[a.difficulty as keyof typeof order];
        });

    const difficultyTag = (level: string) => {
        const base = 'text-xs font-semibold px-2 py-[1px] rounded-full';
        switch (level) {
            case 'EASY':
                return `${base} bg-green-100 text-green-700`;
            case 'MEDIUM':
                return `${base} bg-yellow-100 text-yellow-700`;
            case 'HARD':
                return `${base} bg-red-100 text-red-700`;
            default:
                return base;
        }
    };

    const toggleSort = (field: 'difficulty' | 'frequency') => {
        if (sortBy === field) {
            setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };

    return (
        <div className="min-h-screen bg-white text-black font-mono">
            {/* ✅ Navbar */}
            <nav className="flex justify-between items-center px-6 py-2 border-b shadow-sm bg-gray-50">
                <div className="text-xl font-bold text-blue-700 tracking-tight">AlgoHell</div>
                <div className="flex items-center gap-4 text-sm">
                    {/* <a
                        href="#"
                        className="text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                    >
                        Login with GitHub
                    </a> */}
                    <a
                        href="https://github.com/0jk6/AlgoHell" // Replace with actual link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-yellow-100"
                    >
                        ⭐ Star on GitHub
                    </a>
                </div>
            </nav>

            {/* Filters */}
            <div className="px-6 mt-6">
                <div className="flex flex-wrap gap-4 mb-2 items-center text-sm">
                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border px-2 py-1 rounded w-full sm:w-64"
                    />

                    <select
                        className="border px-2 py-1 rounded"
                        value={selectedCompany}
                        onChange={e => setSelectedCompany(e.target.value)}
                    >
                        <option value="">All Companies</option>
                        {allCompanies.map(c => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border px-2 py-1 rounded"
                        value={selectedTopic}
                        onChange={e => setSelectedTopic(e.target.value)}
                    >
                        <option value="">All Topics</option>
                        {allTopics.map(t => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 🎯 Problem Count and ✅ Completed Count */}
                <div className="text-sm text-gray-600 mb-4">
                    Total <span className="font-semibold">{filtered.length}</span> problem
                    {filtered.length !== 1 ? 's' : ''} : {' '}
                    <span className="font-semibold">
                        {filtered.filter(q => completed.includes(q.question)).length}
                    </span>{' '}
                    completed
                </div>
            </div>



            {/* Table */}
            <div className="px-6">
                <table className="w-full text-sm table-auto">
                    <thead className="border-b border-gray-300 text-left text-xs text-gray-600">
                        <tr>
                            <th className="pb-2 w-[1%]">✔</th>
                            <th className="pb-2 w-[40%]">Problem</th>
                            <th className="pb-2 w-[30%]">Topics</th>
                            <th
                                className="pb-2 cursor-pointer w-[1%]"
                                onClick={() => toggleSort('difficulty')}
                            >
                                Difficulty <ArrowUpDown className="inline w-4 h-4 ml-1" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((q, idx) => {
                            const topicsArray =
                                typeof q.topics === 'string'
                                    ? q.topics.split(',').map(t => t.trim())
                                    : [];

                            return (
                                <tr
                                    key={idx}
                                    onClick={() => toggleComplete(q.question)}
                                    className={`border-t cursor-pointer ${completed.includes(q.question)
                                        ? 'bg-green-50 hover:bg-green-100'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <td className="py-2 w-[1%]">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                toggleComplete(q.question);
                                            }}
                                            className="focus:outline-none"
                                            aria-label="toggle complete"
                                        >
                                            {completed.includes(q.question) ? (
                                                <span className="text-green-600">✔</span>
                                            ) : (
                                                <span className="text-gray-400">☐</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-2 w-[40%]">
                                        <Link
                                            href={q.link}
                                            target="_blank"
                                            onClick={e => e.stopPropagation()}
                                            className="hover:underline text-blue-700 font-semibold"
                                        >
                                            {q.question} ↗
                                        </Link>
                                    </td>
                                    <td className="py-2 w-[30%] text-gray-700">
                                        <div className="truncate" title={topicsArray.join(', ')}>
                                            {topicsArray.slice(0, 4).join(', ')}
                                            {topicsArray.length > 4 ? ', ...' : ''}
                                        </div>
                                    </td>
                                    <td className="py-2 w-[1%]">
                                        <span className={difficultyTag(q.difficulty)}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
