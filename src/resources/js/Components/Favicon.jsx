import React from 'react';
import { Helmet } from 'react-helmet';
import favicon from '../../assets/images/favicon.ico'; // ファビコンをインポート

const Favicon = () => {
    return (
        <Helmet>
            <link rel="icon" href={favicon} type="image/x-icon" />
        </Helmet>
    );
};

export default Favicon;
