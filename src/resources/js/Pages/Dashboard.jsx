// components/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflows } from '../store/workflowSlice';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { workflows, loading, error } = useSelector((state) => state.workflow);

    useEffect(() => {
        dispatch(fetchWorkflows()); // ワークフローを取得
    }, [dispatch]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <h2 className="text-lg font-semibold mb-4">あなたが作成したワークフロー</h2>
                            {loading && <p>Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {workflows.map(workflow => (
                                <div key={workflow.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                                    <Link href={route('workflows.show', workflow.id)} className="mt-2 text-blue-500 hover:underline">
                                        詳細を見る
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
