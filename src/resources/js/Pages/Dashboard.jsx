import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [workflows, setWorkflows] = useState([]);

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const response = await axios.get('/api/workflows');
                setWorkflows(response.data);
            } catch (error) {
                console.error("Error fetching workflows:", error);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <h2 className="text-lg font-semibold mb-4">あなたが作成したワークフロー</h2>
                            {workflows.map(workflow => (
                                <div key={workflow.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                                    {/* <p className="text-gray-500">詳細情報がここに入ります</p> */}
                                    <Link href={route('workflows.show', workflow.id)} className="mt-2 text-blue-500 hover:underline">
                                         詳細を見る
                                    </Link>
                                    {/* <button className="mt-2 text-blue-500 hover:underline">
                                        詳細を見る
                                    </button> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
