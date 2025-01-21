import React, { useState } from 'react';
import DocumentForm from '../../component/documentForm/DocumentForm';
import ExcelJS from 'exceljs';
import { TextField, Typography, Box } from '@mui/material';

function Invoice() {
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
    const [bankInfo, setBankInfo] = useState('');
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
            const filePath = process.env.PUBLIC_URL + '/template/invoice_template.xlsx';
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('テンプレートファイルが見つかりません');
            }
            const arrayBuffer = await response.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            const worksheet = workbook.getWorksheet(1);

            // 発行ナンバー入力
            const No_cell = worksheet.getCell('M2');
            No_cell.value = 1;
            // 請求日入力
            const date_cell = worksheet.getCell('M3');
            date_cell.value = new Date().toLocaleDateString();

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

            // 発注内容を設定
            items.forEach((item, index) => {
                const rowNumber = 17 + index;
                worksheet.getCell(`C${rowNumber}`).value = item.productName;
                worksheet.getCell(`I${rowNumber}`).value = Number(item.quantity);
                worksheet.getCell(`J${rowNumber}`).value = item.unit === 'その他' ? customUnits[index] : item.unit;
                worksheet.getCell(`K${rowNumber}`).value = Number(item.price);
            });

            // 備考欄を設定
            worksheet.getCell('D46').value = remarks;
            // 振込先を設定
            worksheet.getCell('D50').value = bankInfo;

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

    // 追加フィールドのコンポーネント
    const additionalFields = (
        <>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    追加情報
                </Typography>
                <TextField
                    label="備考"
                    value={remarks}
                    onChange={(e) => {
                        if (e.target.value.length <= 120) {
                            setRemarks(e.target.value);
                        }
                    }}
                    multiline
                    rows={3}
                    fullWidth
                    helperText={`${remarks.length}/120文字`}
                    error={remarks.length >= 120}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    label="振込先"
                    value={bankInfo}
                    onChange={(e) => {
                        if (e.target.value.length <= 90) {
                            setBankInfo(e.target.value);
                        }
                    }}
                    multiline
                    rows={2}
                    fullWidth
                    helperText={`${bankInfo.length}/90文字`}
                    error={bankInfo.length >= 90}
                />
            </Box>
        </>
    );

    return (
        <div>
            <DocumentForm
                title="請求書"
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
        </div>
    );
}

export default Invoice;
