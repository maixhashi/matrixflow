import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // ReduxのProviderをインポート
import store from './store/store'; // Reduxのstoreをインポート
import axios from 'axios';

// CSRFトークンを取得する関数
const csrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
};

// Axiosのデフォルトヘッダーを設定
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
            <Provider store={store}> {/* ReduxのProviderでアプリ全体をラップ */}
                <App {...props} />
            </Provider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
