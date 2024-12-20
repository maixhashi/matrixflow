import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // ReduxのProviderをインポート
import store from './store/store'; // Reduxのstoreをインポート
import axios from 'axios';
import { DndProvider } from 'react-dnd'; // react-dnd の DndProvider をインポート
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5Backend をインポート
import Layout from './Layouts/Layout';
import { Helmet } from 'react-helmet';
import PositionUpdater from './Components/PositionUpdater';


// CSRFトークンを取得する関数（nullチェックを追加）
const csrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : '';
};

// Axiosのデフォルトヘッダーを設定
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken();

const appName = import.meta.env.VITE_APP_NAME || 'matrixflow';


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <Provider store={store}>
                    <PositionUpdater />
                    <DndProvider backend={HTML5Backend}>
                        <Layout>
                            <Helmet>
                                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                            </Helmet>

                            <App {...props} />
                        </Layout>
                    </DndProvider>
                </Provider>
            </>
        );
        
    },
    progress: {
        color: '#4B5563',
    },
});