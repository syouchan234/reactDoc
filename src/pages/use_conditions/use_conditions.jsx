import React from 'react';
import './use_conditions.css';

function UseConditions() {
    return (
        <div className="use-conditions">
            <h1>利用規約</h1>
            <div className="section">
                <h2>第1条（適用）</h2>
                <p>
                    この利用規約（以下「本規約」といいます。）は、TanaTeck（以下「当社」といいます。）が提供する帳票作成支援ツール（以下「本サービス」といいます。）の利用に関する条件を定めるものです。ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。
                </p>
            </div>
            <div className="section">
                <h2>第2条（利用登録）</h2>
                <p>
                    1. 本サービスを利用するには、特に今のところは利用登録をする必要性がありません。<br />
                </p>
            </div>
            <div className="section">
                <h2>第3条（禁止事項）</h2>
                <p>
                    ユーザーは、以下の行為を行ってはなりません。<br />
                    1. 法令または公序良俗に反する行為<br />
                    2. 他のユーザーまたは第三者の権利を侵害する行為<br />
                    3. 本サービスの運営を妨害する行為<br />
                    4. 当社の承諾なく、本サービスを商業目的で利用する行為<br />
                    5. その他、当社が不適切と判断する行為
                </p>
            </div>
            <div className="section">
                <h2>第4条（著作権）</h2>
                <p>
                    1. 本サービスに関する著作権、商標権、その他の知的財産権は、すべて当社または当社にライセンスを供与した第三者に帰属します。<br />
                    2. ユーザーは、本サービスを利用することにより、当社の著作権を侵害することのないように注意しなければなりません。
                </p>
            </div>
            <div className="section">
                <h2>第5条（免責事項）</h2>
                <p>
                    1. 当社は、本サービスの利用に関して、ユーザーに対して一切の責任を負いません。<br />
                    2. 当社は、本サービスの内容や機能について、予告なく変更または中止することがあります。
                </p>
            </div>
            <div className="section">
                <h2>第6条（利用規約の変更）</h2>
                <p>
                    当社は、本規約を随時変更することができるものとします。変更後の利用規約は、本サービス上に掲示した時点で効力を生じるものとします。
                </p>
            </div>
            <div className="section">
                <h2>第7条（準拠法・管轄）</h2>
                <p>
                    本規約は、日本法に準拠します。また、本サービスに関する紛争については、当社の本社所在地を管轄する裁判所を専属的な管轄裁判所とします。
                </p>
            </div>
            <div className="section">
                <h2>第8条（お問い合わせ）</h2>
                <p>
                    本サービスに関するお問い合わせは、以下の連絡先までお願いいたします。<br />
                    <strong><a href="http://tanakatech.starfree.jp" target="_blank" rel="noreferrer">TanakaTeck</a></strong><br/>
                </p>
            </div>
        </div>
    );
}

export default UseConditions;