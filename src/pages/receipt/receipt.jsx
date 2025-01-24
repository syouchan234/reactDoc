import React, { useState } from 'react';
import DocumentForm from '../../component/documentForm/DocumentForm';
import ExcelJS from 'exceljs';
import { 
    TextField, 
    Typography, 
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

function Receipt() {
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
    const [receiptType, setReceiptType] = useState('A'); // A: 明細あり, B: 明細なし

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

    const handleDownload = async () => {
        try {
            // テンプレートの選択
            const templateFile = receiptType === 'A' 
                ? 'receipt_typeA_template.xlsx' 
                : 'receipt_typeB_template.xlsx';
            
            const filePath = process.env.PUBLIC_URL + '/template/' + templateFile;
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('テンプレートファイルが見つかりません');
            }
            const arrayBuffer = await response.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            const worksheet = workbook.getWorksheet(1);

            const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
            const companyInfo = JSON.parse(localStorage.getItem('companyInfo'));

            if (receiptType === 'A') {
                // タイプA（明細あり）の場合の処理
                worksheet.getCell('M2').value = 1; // 発行ナンバー
                worksheet.getCell('M3').value = new Date().toLocaleDateString(); // 領収日

                // 自社情報
                worksheet.getCell('J5').value = companyInfo.name;
                worksheet.getCell('J7').value = companyInfo.postcode;
                worksheet.getCell('J8').value = companyInfo.address;
                worksheet.getCell('J9').value = companyInfo.building;
                worksheet.getCell('J10').value = companyInfo.tel;
                worksheet.getCell('M10').value = companyInfo.fax;
                worksheet.getCell('J11').value = companyInfo.email;

                // 顧客情報
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
                    worksheet.getCell(`J${rowNumber}`).value = item.unit;
                    worksheet.getCell(`K${rowNumber}`).value = Number(item.price);
                });

                // 備考欄
                worksheet.getCell('D46').value = remarks;
            } else {
                // タイプB（明細なし）の場合の処理
                worksheet.getCell('P4').value = 1; // 発行ナンバー
                worksheet.getCell('P5').value = new Date().toLocaleDateString(); // 発行日

                // 顧客情報
                worksheet.getCell('B6').value = customerInfo.name;
                worksheet.getCell('C8').value = `${customerInfo.postcode} ${customerInfo.address}`;
                worksheet.getCell('C9').value = customerInfo.department;
                worksheet.getCell('E9').value = `担当者：${customerInfo.manager}`;

                // 自社情報
                worksheet.getCell('K23').value = companyInfo.name;
                worksheet.getCell('K24').value = companyInfo.postcode;
                worksheet.getCell('K25').value = companyInfo.address;
                worksheet.getCell('K26').value = companyInfo.building;

                // 合計金額から税額計算
                const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
                worksheet.getCell('G24').value = totalAmount; // 小計（税抜き金額）
                const tax = totalAmount * 0.1;
                worksheet.getCell('G25').value = tax; // 消費税
                const result = tax + totalAmount;
                worksheet.getCell('G26').value = result; //税込み合計金額
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = '領収書.xlsx';
            anchor.click();
            window.URL.revokeObjectURL(url);
            setSuccess(true);
        } catch (err) {
            console.error('Error processing file:', err);
            setError(err.message);
        }
    };

    // 追加フィールドのコンポーネント
    const additionalFields = (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                追加情報
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>領収書タイプ</InputLabel>
                <Select
                    value={receiptType}
                    onChange={(e) => setReceiptType(e.target.value)}
                    label="領収書タイプ"
                >
                    <MenuItem value="A">タイプA（明細あり）</MenuItem>
                    <MenuItem value="B">タイプB（明細なし）</MenuItem>
                </Select>
            </FormControl>
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
    );

    return (
        <DocumentForm
            title="領収書"
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
        />
    );
}

export default Receipt;