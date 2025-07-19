// Updated QuestionTable.tsx without pagination

'use client';

import { useState, useEffect } from 'react';
import questions from '../data/questions.json';
import { Check, Star, StarOff, Video, ArrowUpDown } from 'lucide-react';
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
    const [starred, setStarred] = useState<string[]>([]);
    const [completed, setCompleted] = useState<string[]>([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'difficulty' | 'frequency' | ''>('');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedStars = JSON.parse(localStorage.getItem('starred') || '[]');
            const savedCompleted = JSON.parse(localStorage.getItem('completed') || '[]');
            const savedCompany = localStorage.getItem('selectedCompany') || '';
            const savedTopic = localStorage.getItem('selectedTopic') || '';
            setStarred(savedStars);
            setCompleted(savedCompleted);
            setSelectedCompany(savedCompany);
            setSelectedTopic(savedTopic);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('starred', JSON.stringify(starred));
            localStorage.setItem('completed', JSON.stringify(completed));
        }
    }, [starred, completed]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedCompany', selectedCompany);
            localStorage.setItem('selectedTopic', selectedTopic);
        }
    }, [selectedCompany, selectedTopic]);

    const toggleStar = (title: string) => {
        setStarred(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const toggleComplete = (title: string) => {
        setCompleted(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const allCompanies = Array.from(
        new Set(questions.flatMap(q => q.companies.split(',').map(c => c.trim())))
    ).sort();

    const allTopics = Array.from(
        new Set(questions.flatMap(q => q.topics.split(',').map(t => t.trim())))
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

    const difficultyColor = (level: string) => {
        switch (level) {
            case 'EASY':
                return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold';
            case 'MEDIUM':
                return 'bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold';
            case 'HARD':
                return 'bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold';
            default:
                return '';
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
        <div className="p-6 overflow-x-auto">
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border px-2 py-1 rounded w-full sm:w-60"
                />

                <div>
                    <label className="mr-2 font-semibold text-black">Company:</label>
                    <select
                        className="border px-2 py-1 rounded"
                        value={selectedCompany}
                        onChange={e => setSelectedCompany(e.target.value)}
                    >
                        <option value="">All</option>
                        {allCompanies.map(company => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mr-2 font-semibold text-black">Topic:</label>
                    <select
                        className="border px-2 py-1 rounded"
                        value={selectedTopic}
                        onChange={e => setSelectedTopic(e.target.value)}
                    >
                        <option value="">All</option>
                        {allTopics.map(topic => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="min-w-full text-sm text-left border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Star</th>
                        <th className="px-3 py-2">Problem</th>
                        <th
                            className="px-3 py-2 cursor-pointer"
                            onClick={() => toggleSort('difficulty')}
                        >
                            Difficulty <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((q, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={completed.includes(q.question)}
                                    onChange={() => toggleComplete(q.question)}
                                    className="accent-blue-600"
                                />
                            </td>
                            <td className="px-3 py-2 cursor-pointer" onClick={() => toggleStar(q.question)}>
                                {starred.includes(q.question) ? (
                                    <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                                ) : (
                                    <StarOff className="text-yellow-400 w-5 h-5" />
                                )}
                            </td>
                            <td className="px-3 py-2 text-black font-medium">
                                <Link href={q.link} target="_blank" className="hover:underline text-blue-700">
                                    {q.question} ↗
                                </Link>
                            </td>
                            <td className="px-3 py-2">
                                <span className={difficultyColor(q.difficulty)}>{q.difficulty}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
