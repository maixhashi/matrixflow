import { Link } from '@inertiajs/react';
import logo from '../../assets/images/matrixflow.png';
import '../../css/Header.css';

const Header = ({ auth }) => {
    // authがundefinedの場合のデフォルト値を設定
    const user = auth ? auth.user : null;

    return (
        <header className="grid grid-cols-2 items-center gap-2 lg:grid-cols-3">
            <div className="flex items-center">
              <Link
                      href={route('root')}
                      className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
              >
                <img src={logo} alt="ロゴ" className="logo" />
              </Link>
            </div>
            <nav className="flex justify-end col-span-2"> {/* col-span-2を追加 */}
                {user ? (
                    <Link
                        href={route('dashboard')}
                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        {/* <Link
                            href={route('guest.matrixflow.create')}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            マトリクスフローを作成してみる(お試し用)
                        </Link> */}
                        <Link
                            href={route('login')}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            ログイン
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            アカウントを作成
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
