import React from 'react';
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
    units = ['個', 'kg', '台', '人', '時間']
}) => {
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
                                        onChange={(e) => onUpdateItem(index, 'unit', e.target.value)}
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