import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MatrixView from '@/Components/MatrixView'; // MatrixView コンポーネントをインポート
import '../../css/WorkflowDetailPage.css'

export default function WorkflowDetailPage({ workflow }) {
    return (
        <AuthenticatedLayout>
            <Head title={workflow.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold">{workflow.name}</h2>
                            <p className="mt-4"></p>
                            <ul className="list-disc list-inside mt-2">
                              <li>作成日: {new Date(workflow.created_at).toLocaleString()}</li>
                              <li>更新日: {new Date(workflow.updated_at).toLocaleString()}</li>
                            </ul>
                            <div class="MatrixView-on-WorkflowDetailPage">
                              <MatrixView workflowId={workflow.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
