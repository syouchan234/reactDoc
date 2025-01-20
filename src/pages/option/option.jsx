import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, Stack, Snackbar, Alert } from '@mui/material';
import './option.css';

function Option() {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    postcode: '',
    address: '',
    building: '',
    tel: '',
    fax: '',
    email: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // コンポーネントマウント時にローカルストレージから値を読み込む
  useEffect(() => {
    const savedInfo = localStorage.getItem('companyInfo');
    if (savedInfo) {
      setCompanyInfo(JSON.parse(savedInfo));
    } else {
      // サンプルデータを設定
      const sampleInfo = {
        name: '株式会社サンプル',
        postcode: '〒123-4567',
        address: '東京都渋谷区サンプル1-2-3',
        building: 'サンプルビル',
        tel: '03-1234-5678',
        fax: '03-1234-5679',
        email: 'info@sample.com'
      };
      localStorage.setItem('companyInfo', JSON.stringify(sampleInfo));
      setCompanyInfo(sampleInfo);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
      setSuccess(true);
    } catch (err) {
      setError('保存に失敗しました');
    }
  };

  const handleDelete = () => {
    try {
      localStorage.removeItem('companyInfo');
      setCompanyInfo({
        name: '',
        postcode: '',
        address: '',
        building: '',
        tel: '',
        fax: '',
        email: ''
      });
      setSuccess(true);
    } catch (err) {
      setError('削除に失敗しました');
    }
  };

  return (
    <div className="option-container">
      <h1>自社署名設定</h1>
      <Card className="option-card">
        <Stack spacing={2} padding={3}>
          <TextField
            label="会社名"
            name="name"
            value={companyInfo.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="郵便番号"
            name="postcode"
            value={companyInfo.postcode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="住所"
            name="address"
            value={companyInfo.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="建物名"
            name="building"
            value={companyInfo.building}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="電話番号"
            name="tel"
            value={companyInfo.tel}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="FAX"
            name="fax"
            value={"📠"+companyInfo.fax}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="メールアドレス"
            name="email"
            value={"✉"+companyInfo.email}
            onChange={handleChange}
            fullWidth
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleDelete}
            >
              削除
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave}
            >
              保存
            </Button>
          </Stack>
        </Stack>
      </Card>

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
    </div>
  );
}

export default Option;