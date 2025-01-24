import React, { useState } from 'react';
import DocumentForm from '../../component/documentForm/DocumentForm';
import ExcelJS from 'exceljs';
import { TextField, Typography, Box } from '@mui/material';

function Estimate() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [items, setItems] = useState([
        {
            productName: '',
            quantity: '',
            unit: '個',
            price: ''
        }
    ]);
    const [remarks, setRemarks] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [customUnits, setCustomUnits] = useState({});

    const handleAddItem = () => {
        if (items.length >= 24) {
            setError('明細は24件までしか登録できません');
            return;
        }
        setItems(prev => [...prev, {
            productName: '',
            quantity: '',
            unit: '個',
            price: ''
        }]);
    };

    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateItem = (index, field, value) => {
        setItems(prev => prev.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const handleCustomUnitChange = (newCustomUnits) => {
        setCustomUnits(newCustomUnits);
    };

    const handleDownload = async () => {
        try {
            const filePath = `${window.location.origin}${process.env.PUBLIC_URL}/template/estimate_template.xlsx`;
            
            console.log('Trying to fetch template from:', filePath); // デバッグ用

            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(
                    '見積書テンプレートファイルの読み込みに失敗しました。\n' +
                    `ステータス: ${response.status}\n` +
                    `パス: ${filePath}\n` +
                    'public/template/estimate_template.xlsx が存在するか確認してください。'
                );
            }

            const arrayBuffer = await response.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            
            try {
                await workbook.xlsx.load(arrayBuffer);
            } catch (error) {
                throw new Error(
                    'Excelファイルの読み込みに失敗しました。\n' +
                    'ファイルが破損している可能性があります。\n' +
                    error.message
                );
            }

            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) {
                throw new Error('ワークシートが見つかりません。テンプレートファイルを確認してください。');
            }

            console.log('Worksheet loaded:', worksheet.name); // デバッグ用

            // 以降のコードは、worksheetが正しく取得できた場合のみ実行
            try {
                // 発行ナンバー入力
                worksheet.getCell('M2').value = 1;
                // 見積日入力
                worksheet.getCell('M3').value = new Date().toLocaleDateString();

                // 自社情報を設定
                const companyInfo = JSON.parse(localStorage.getItem('companyInfo'));
                worksheet.getCell('J5').value = companyInfo.name;
                worksheet.getCell('J7').value = companyInfo.postcode;
                worksheet.getCell('J8').value = companyInfo.address;
                worksheet.getCell('J9').value = companyInfo.building;
                worksheet.getCell('J10').value = companyInfo.tel;
                worksheet.getCell('M10').value = companyInfo.fax;
                worksheet.getCell('J11').value = companyInfo.email;

                // 顧客情報を設定
                const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
                worksheet.getCell('B5').value = customerInfo.name;
                worksheet.getCell('B7').value = customerInfo.postcode;
                worksheet.getCell('D7').value = customerInfo.address;
                worksheet.getCell('C8').value = customerInfo.department;
                worksheet.getCell('E8').value = customerInfo.manager;

                // 明細を設定
                items.forEach((item, index) => {
                    const rowNumber = 17 + index;
                    worksheet.getCell(`C${rowNumber}`).value = item.productName;
                    worksheet.getCell(`I${rowNumber}`).value = Number(item.quantity);
                    worksheet.getCell(`J${rowNumber}`).value = item.unit === 'その他' ? customUnits[index] : item.unit;
                    worksheet.getCell(`K${rowNumber}`).value = Number(item.price);
                });

                // 有効期限を設定
                worksheet.getCell('F42').value = expiryDate;
                
                // 備考欄を設定
                worksheet.getCell('D46').value = remarks;

                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = '見積書.xlsx';
                anchor.click();
                window.URL.revokeObjectURL(url);
                setSuccess(true);
            } catch (error) {
                throw new Error(
                    'セルの操作中にエラーが発生しました。\n' +
                    'テンプレートファイルの形式を確認してください。\n' +
                    error.message
                );
            }

        } catch (err) {
            console.error('Error processing file:', err);
            setError(err.message);
        }
    };

    // 追加フィールドのコンポーネント
    const additionalFields = (
        <>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    追加情報
                </Typography>
                <TextField
                    label="有効期限"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="備考"
                    value={remarks}
                    onChange={(e) => {
                        if (e.target.value.length <= 270) {
                            setRemarks(e.target.value);
                        }
                    }}
                    multiline
                    rows={4}
                    fullWidth
                    helperText={`${remarks.length}/270文字`}
                    error={remarks.length >= 270}
                />
            </Box>
        </>
    );

    return (
        <DocumentForm
            title="見積書"
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
            onSubmit={handleDownload}
            error={error}
            success={success}
            onErrorClose={() => setError(null)}
            onSuccessClose={() => setSuccess(false)}
            additionalFields={additionalFields}
            onCustomUnitChange={handleCustomUnitChange}
        />
    );
}

export default Estimate;