import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Invoice() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const downloadExcel = async () => {
        try {
            // 既存のExcelファイルを読み込む
            const filePath = process.env.PUBLIC_URL + '/template/invoice_template.xlsx';
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('テンプレートファイルが見つかりません');
            }
            const arrayBuffer = await response.arrayBuffer();
            // ワークブックを読み込む
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            // 最初のワークシートを取得
            const worksheet = workbook.getWorksheet(1);
            // セルに値を書き込む（既存のスタイルは保持されます）
            //発行ナンバー入力
            const No_cell = worksheet.getCell('M2');
            No_cell.value = 1;
            //請求日入力
            const date_cell = worksheet.getCell('M3');
            date_cell.value = '2024/01/01';
            //ローカルストレージから自社情報を取得
            const companyInfo = JSON.parse(localStorage.getItem('companyInfo'));
            // 自社情報を設定
            const company_cell = worksheet.getCell('J5');
            company_cell.value = companyInfo.name;
            const post_cell = worksheet.getCell('J7');
            post_cell.value = companyInfo.postcode;
            const address_cell = worksheet.getCell('J8');
            address_cell.value = companyInfo.address;
            const building_cell = worksheet.getCell('J9');
            building_cell.value = companyInfo.building;
            const tel_cell = worksheet.getCell('J10');
            tel_cell.value = companyInfo.tel;
            const fax_cell = worksheet.getCell('M10');
            fax_cell.value = companyInfo.fax;
            const mail_cell = worksheet.getCell('J11');
            mail_cell.value = companyInfo.email;
            //顧客入力
            const customer_name_cell = worksheet.getCell('B5');
            customer_name_cell.value = '株式会社 怨社';
            const customer_post_cell = worksheet.getCell('B7');
            customer_post_cell.value = '〒546-0023';
            const customer_address_cell = worksheet.getCell('D7');
            customer_address_cell.value = '東京都世田谷区 1-2-3';
            const customer_department_cell = worksheet.getCell('C8');
            customer_department_cell.value = '営業部';
            const customer_manager_cell = worksheet.getCell('E8');
            customer_manager_cell.value = +"担当者:"+'山脇浩二';
            //24行分まで登録可能(40行目まで)
            const product_name_cell = worksheet.getCell('C17');
            product_name_cell.value = 'レンガ';
            const product_num_cell = worksheet.getCell('I17');
            product_num_cell.value = 123;
            const product_num_name_cell = worksheet.getCell('J17');
            product_num_name_cell.value = '個';//個,kg,台,人,時間,その他(記述)
            const product_price_cell = worksheet.getCell('K17');
            product_price_cell.value = 100;
            // ファイルをダウンロード
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = '請求書.xlsx';
            anchor.click();
            window.URL.revokeObjectURL(url);
            setSuccess(true);
        } catch (err) {
            console.error('Error processing file:', err);
            setError(err.message);
        }
    };

    // エクセルからデータを読み込む関数
    const readExcelData = async () => {
        const filePath = process.env.PUBLIC_URL + '/template/invoice_template.xlsx';
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('テンプレートファイルが見つかりません');
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        return workbook.getWorksheet(1);
    };

    // PDFをダウンロードする関数
    const downloadPDF = async () => {
        try {
            const worksheet = await readExcelData();
            const companyInfo = JSON.parse(localStorage.getItem('companyInfo'));

            // PDFドキュメントを作成
            const doc = new jsPDF();
            doc.setFont('helvetica');
            doc.setFontSize(20);
            doc.text('請求書', 105, 20, { align: 'center' });

            // 発行情報
            doc.setFontSize(10);
            doc.text(`発行No: ${worksheet.getCell('M2').value}`, 150, 30);
            doc.text(`発行日: ${worksheet.getCell('M3').value}`, 150, 35);

            // 自社情報
            doc.text(companyInfo.name, 150, 45);
            doc.text(companyInfo.postcode, 150, 50);
            doc.text(companyInfo.address, 150, 55);
            doc.text(companyInfo.building, 150, 60);
            doc.text(companyInfo.tel, 150, 65);
            doc.text(companyInfo.fax, 150, 70);
            doc.text(companyInfo.email, 150, 75);

            // 顧客情報
            doc.text(worksheet.getCell('B5').value, 20, 45);
            doc.text(worksheet.getCell('B7').value, 20, 50);
            doc.text(worksheet.getCell('D7').value, 20, 55);
            doc.text(worksheet.getCell('C8').value, 20, 60);
            doc.text(worksheet.getCell('E8').value, 20, 65);

            // 商品テーブル
            const tableData = [];
            // 商品データを配列に追加
            tableData.push([
                worksheet.getCell('C17').value,
                worksheet.getCell('I17').value,
                worksheet.getCell('J17').value,
                worksheet.getCell('K17').value,
                worksheet.getCell('K17').value * worksheet.getCell('I17').value
            ]);

            doc.autoTable({
                startY: 85,
                head: [['商品名', '数量', '単位', '単価', '金額']],
                body: tableData,
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [200, 200, 200],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                },
            });

            // PDFを保存
            doc.save('請求書.pdf');
            setSuccess(true);
        } catch (err) {
            console.error('Error generating PDF:', err);
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>請求書</h1>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={downloadExcel}
                style={{ margin: '0 10px' }}
            >
                .xlsxでダウンロード
            </Button>
            <Button 
                variant="contained" 
                color="primary"
                onClick={downloadPDF}
                style={{ margin: '0 10px' }}
            >
                .pdfでダウンロード
            </Button>

            {/* エラー通知 */}
            <Snackbar 
                open={error !== null} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            {/* 成功通知 */}
            <Snackbar 
                open={success} 
                autoHideDuration={6000} 
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    ファイルが正常にダウンロードされました
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Invoice;
