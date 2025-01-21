import React, { useState } from 'react';
import { 
    Button, 
    TextField, 
    Card, 
    Stack, 
    Snackbar, 
    Alert,
    IconButton,
    Box,
    Grid,
    MenuItem,
    Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExcelJS from 'exceljs';
import './invoice.css';

function Invoice() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [orderItems, setOrderItems] = useState([
        {
            productName: '',
            quantity: '',
            unit: '個',
            price: ''
        }
    ]);

    const units = ['個', 'kg', '台', '人', '時間'];

    // 発注内容の追加
    const addOrderItem = () => {
        if (orderItems.length >= 24) {
            setError('発注内容は24件までしか登録できません');
            return;
        }
        setOrderItems(prev => [...prev, {
            productName: '',
            quantity: '',
            unit: '個',
            price: ''
        }]);
    };

    // 発注内容の削除
    const removeOrderItem = (index) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    // 発注内容の更新
    const updateOrderItem = (index, field, value) => {
        setOrderItems(prev => prev.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const downloadExcel = async () => {
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
            orderItems.forEach((item, index) => {
                const rowNumber = 17 + index;
                worksheet.getCell(`C${rowNumber}`).value = item.productName;
                worksheet.getCell(`I${rowNumber}`).value = Number(item.quantity);
                worksheet.getCell(`J${rowNumber}`).value = item.unit;
                worksheet.getCell(`K${rowNumber}`).value = Number(item.price);
            });

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

    return (
        <div className="invoice">
            <h1>請求書</h1>
            <Card className="invoice-card">
                <Stack spacing={3} padding={3}>
                    <Typography variant="h6">発注内容</Typography>
                    {orderItems.map((item, index) => (
                        <Box key={index} sx={{ position: 'relative', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="商品名"
                                        value={item.productName}
                                        onChange={(e) => updateOrderItem(index, 'productName', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        label="数量"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        select
                                        label="単位"
                                        value={item.unit}
                                        onChange={(e) => updateOrderItem(index, 'unit', e.target.value)}
                                        fullWidth
                                    >
                                        {units.map((unit) => (
                                            <MenuItem key={unit} value={unit}>
                                                {unit}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        label="単価"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateOrderItem(index, 'price', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            {orderItems.length > 1 && (
                                <IconButton
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => removeOrderItem(index)}
                                    color="error"
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={addOrderItem}
                        variant="outlined"
                        disabled={orderItems.length >= 24}
                    >
                        発注内容を追加
                    </Button>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={downloadExcel}
                    >
                        請求書をダウンロード
                    </Button>
                </Stack>
            </Card>

            <Snackbar 
                open={error !== null} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

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
