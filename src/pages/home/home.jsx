import React from 'react';
import './home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>書類発行ツール</h1>
            <div>
                まずは<b>顧客情報</b>と<b>自社署名</b>を行ってください<br/>
            </div>
            <div>
                顧客情報は右下の丸いボタンをクリックして設定してください<br/>
            </div>
            <div>
                自社情報はヘッダーの設定から設定してください<br/>
            </div>
        </div>
    );
};

export default Home;