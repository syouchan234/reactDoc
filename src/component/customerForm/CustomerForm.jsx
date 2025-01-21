import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    Button, 
    Stack, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import './CustomerForm.css';

function CustomerForm({ open, onClose }) {
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        postcode: '',
        address: '',
        department: '',
        manager: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedInfo = localStorage.getItem('customerInfo');
        if (savedInfo) {
            setCustomerInfo(JSON.parse(savedInfo));
        } else {
            const sampleInfo = {
                name: '株式会社サンプル顧客',
                postcode: '〒123-4567',
                address: '東京都渋谷区サンプル1-2-3',
                department: '営業部',
                manager: '担当者:山田太郎',
            };
            localStorage.setItem('customerInfo', JSON.stringify(sampleInfo));
            setCustomerInfo(sampleInfo);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        try {
            localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
            setSuccess(true);
            onClose();
        } catch (err) {
            setError('保存に失敗しました');
        }
    };

    const handleDelete = () => {
        try {
            localStorage.removeItem('customerInfo');
            setCustomerInfo({
                name: '',
                postcode: '',
                address: '',
                department: '',
                manager: '',
            });
            setSuccess(true);
        } catch (err) {
            setError('削除に失敗しました');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>顧客情報設定</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} padding={2}>
                        <TextField
                            label="会社名"
                            name="name"
                            value={customerInfo.name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="郵便番号"
                            name="postcode"
                            value={customerInfo.postcode}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="住所"
                            name="address"
                            value={customerInfo.address}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="部署"
                            name="department"
                            value={customerInfo.department}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="担当者"
                            name="manager"
                            value={customerInfo.manager}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleDelete}>
                        削除
                    </Button>
                    <Button onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button onClick={handleSave} variant="contained">
                        保存
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={success} 
                autoHideDuration={6000} 
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    操作が完了しました
                </Alert>
            </Snackbar>

            <Snackbar 
                open={error !== null} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}

export default CustomerForm; 