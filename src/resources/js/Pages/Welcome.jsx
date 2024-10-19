import logo from '../../assets/images/matrixflow.png'
import '../../css/Welcome.css'; // CSSファイルをインポート

const Welcome = () => {
  return (
    <div className="welcome-page-container">
      <div className="welcome-page-content">
        <div className="catchphrase-on-welcome-page">
          今のフローを明瞭に
        </div>
        <div>
          <img src={logo} alt="ロゴ" className="logo-on-welcome-page" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
