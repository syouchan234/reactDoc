import React from 'react';
import './home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>書類発行ツール</h1>
            <pre>
                まずは顧客情報と自社署名を行ってください
                顧客情報は右下の丸いボタンをクリックして設定してください
                自社情報は右上の設定から設定してください
            </pre>
        </div>
    );
};

export default Home;