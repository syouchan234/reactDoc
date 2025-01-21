import React, { useState, useMemo } from 'react';
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
import './DocumentForm.css';

const DocumentForm = ({ 
    title,
    items,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onSubmit,
    error,
    success,
    onErrorClose,
    onSuccessClose,
    maxItems = 24,
    units = ['個', 'kg', '台', '人', '時間', 'その他'],
    additionalFields,
    onCustomUnitChange
}) => {
    // その他の単位を保持するstate
    const [customUnits, setCustomUnits] = useState({});

    // 金額計算
    const calculations = useMemo(() => {
        const subtotal = items.reduce((sum, item) => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            return sum + (quantity * price);
        }, 0);
        
        const tax = Math.floor(subtotal * 0.1); // 消費税10%（切り捨て）
        const total = subtotal + tax;

        return {
            subtotal,
            tax,
            total
        };
    }, [items]);

    const handleUnitChange = (index, value) => {
        if (value === 'その他') {
            // その他が選択された場合、カスタム単位の初期値を設定
            setCustomUnits(prev => ({
                ...prev,
                [index]: prev[index] || ''
            }));
        } else {
            // その他以外が選択された場合、カスタム単位を削除
            setCustomUnits(prev => {
                const newUnits = { ...prev };
                delete newUnits[index];
                return newUnits;
            });
        }
        onUpdateItem(index, 'unit', value);
    };

    const handleCustomUnitChange = (index, value) => {
        const newCustomUnits = {
            ...customUnits,
            [index]: value
        };
        setCustomUnits(newCustomUnits);
        // 親コンポーネントにカスタム単位の情報を渡す
        if (onCustomUnitChange) {
            onCustomUnitChange(newCustomUnits);
        }
    };

    return (
        <div className="document-form">
            <h1>{title}</h1>
            <Card className="document-form-card">
                <Stack spacing={3} padding={3}>
                    <Typography variant="h6">明細</Typography>
                    {items.map((item, index) => (
                        <Box key={index} sx={{ position: 'relative', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="品名"
                                        value={item.productName}
                                        onChange={(e) => onUpdateItem(index, 'productName', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        label="数量"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => onUpdateItem(index, 'quantity', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        select
                                        label="単位"
                                        value={item.unit}
                                        onChange={(e) => handleUnitChange(index, e.target.value)}
                                        fullWidth
                                    >
                                        {units.map((unit) => (
                                            <MenuItem key={unit} value={unit}>
                                                {unit}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    {item.unit === 'その他' && (
                                        <TextField
                                            label="単位を入力"
                                            value={customUnits[index] || ''}
                                            onChange={(e) => handleCustomUnitChange(index, e.target.value)}
                                            fullWidth
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        label="単価"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => onUpdateItem(index, 'price', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            {items.length > 1 && (
                                <IconButton
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => onRemoveItem(index)}
                                    color="error"
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={onAddItem}
                        variant="outlined"
                        disabled={items.length >= maxItems}
                    >
                        明細を追加
                    </Button>

                    {/* 金額計算表示 */}
                    <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        border: '1px solid #ddd', 
                        borderRadius: 1,
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} />
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>小計（税抜）:</Typography>
                                        <Typography>¥{calculations.subtotal.toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>消費税（10%）:</Typography>
                                        <Typography>¥{calculations.tax.toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        borderTop: '1px solid #ddd',
                                        pt: 1,
                                        fontWeight: 'bold'
                                    }}>
                                        <Typography>請求金額（税込）:</Typography>
                                        <Typography>¥{calculations.total.toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 追加フィールドの表示 */}
                    {additionalFields && (
                        <Box sx={{ mt: 3 }}>
                            {additionalFields}
                        </Box>
                    )}

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={onSubmit}
                    >
                        {title}をダウンロード
                    </Button>
                </Stack>
            </Card>

            <Snackbar 
                open={error !== null} 
                autoHideDuration={6000} 
                onClose={onErrorClose}
            >
                <Alert severity="error" onClose={onErrorClose}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={success} 
                autoHideDuration={6000} 
                onClose={onSuccessClose}
            >
                <Alert severity="success" onClose={onSuccessClose}>
                    ファイルが正常にダウンロードされました
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DocumentForm; 