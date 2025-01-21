import React, { useState } from 'react';
import { 
    Button, 
    TextField, 
    Card, 
    Stack, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    IconButton,
    Box,
    Typography,
    Grid,
    Divider,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import './contract.css';

const Contract = () => {
    // 契約の基本情報
    const [contractInfo, setContractInfo] = useState({
        contractType: 'custom',  // custom: カスタム, sales: 売買, service: 業務委託
        contractName: '',        // 契約書名
        startDate: '',
        endDate: '',
        amount: '',
        paymentTerms: '',
        specialTerms: '',
    });

    // 契約の種類一覧
    const contractTypes = [
        { value: 'custom', label: 'カスタム契約書' },
        { value: 'sales', label: '売買契約書' },
        { value: 'service', label: '業務委託契約書' },
        { value: 'nda', label: '機密保持契約書' },
        { value: 'lease', label: '賃貸借契約書' },
        { value: 'employment', label: '雇用契約書' },
    ];

    // 条項を管理
    const [articles, setArticles] = useState([
        {
            title: '目的',
            content: '',
            subArticles: []  // 項を管理
        }
    ]);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // 署名の表示制御用state
    const [signatures, setSignatures] = useState({
        showCustomerSignature: true,
        showCompanySignature: true
    });

    // 契約基本情報の更新
    const handleChange = (e) => {
        const { name, value } = e.target;
        setContractInfo(prev => ({
            ...prev,
            [name]: value
        }));

        // 契約種別が変更された場合、テンプレートを読み込む
        if (name === 'contractType') {
            loadContractTemplate(value);
        }
    };

    // 契約種別に応じたテンプレートを読み込む
    const loadContractTemplate = (type) => {
        let templateArticles = [];
        switch(type) {
            case 'sales':
                templateArticles = [
                    { title: '目的', content: '甲は乙に対し、以下の商品を販売し、乙はこれを購入する。', subArticles: [] },
                    { title: '売買代金', content: '', subArticles: [] },
                    { title: '支払方法', content: '', subArticles: [] },
                    { title: '引渡し', content: '', subArticles: [] },
                ];
                break;
            case 'service':
                templateArticles = [
                    { title: '目的', content: '甲は乙に対し、以下の業務を委託し、乙はこれを受託する。', subArticles: [] },
                    { title: '委託業務', content: '', subArticles: [] },
                    { title: '委託料', content: '', subArticles: [] },
                    { title: '報告義務', content: '', subArticles: [] },
                ];
                break;
            case 'nda':
                templateArticles = [
                    { title: '目的', content: '', subArticles: [] },
                    { title: '機密情報の定義', content: '', subArticles: [] },
                    { title: '機密保持義務', content: '', subArticles: [] },
                    { title: '損害賠償', content: '', subArticles: [] },
                ];
                break;
            // 他の契約種別のテンプレートも追加可能
            default:
                templateArticles = [{ title: '目的', content: '', subArticles: [] }];
        }
        setArticles(templateArticles);
    };

    // 条項の追加
    const addArticle = () => {
        setArticles(prev => [...prev, { 
            title: '', 
            content: '',
            subArticles: []
        }]);
    };

    // 項の追加
    const addSubArticle = (articleIndex) => {
        setArticles(prev => prev.map((article, index) => {
            if (index === articleIndex) {
                return {
                    ...article,
                    subArticles: [...article.subArticles, { content: '' }]
                };
            }
            return article;
        }));
    };

    // 条項の削除
    const removeArticle = (index) => {
        setArticles(prev => prev.filter((_, i) => i !== index));
    };

    // 項の削除
    const removeSubArticle = (articleIndex, subIndex) => {
        setArticles(prev => prev.map((article, index) => {
            if (index === articleIndex) {
                return {
                    ...article,
                    subArticles: article.subArticles.filter((_, i) => i !== subIndex)
                };
            }
            return article;
        }));
    };

    // 条項の更新
    const updateArticle = (index, field, value) => {
        setArticles(prev => prev.map((article, i) => 
            i === index ? { ...article, [field]: value } : article
        ));
    };

    // 項の更新
    const updateSubArticle = (articleIndex, subIndex, value) => {
        setArticles(prev => prev.map((article, index) => {
            if (index === articleIndex) {
                const newSubArticles = [...article.subArticles];
                newSubArticles[subIndex] = { content: value };
                return { ...article, subArticles: newSubArticles };
            }
            return article;
        }));
    };

    // 署名チェックボックスの変更ハンドラ
    const handleSignatureChange = (name) => (event) => {
        setSignatures(prev => ({
            ...prev,
            [name]: event.target.checked
        }));
    };

    const generateContract = async () => {
        try {
            const companyInfo = JSON.parse(localStorage.getItem('companyInfo'));
            const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));

            // 契約書名が入力されている場合はそれを使用、なければ契約種別から自動生成
            const contractTitle = contractInfo.contractName || 
                (contractInfo.contractType === 'sales' ? "売買契約書" : 
                 contractInfo.contractType === 'service' ? "業務委託契約書" : 
                 contractInfo.contractType === 'nda' ? "機密保持契約書" : 
                 contractInfo.contractType === 'lease' ? "賃貸借契約書" : 
                 contractInfo.contractType === 'employment' ? "雇用契約書" : "契約書");

            // 条項を段落に変換
            const articleParagraphs = articles.flatMap((article, index) => {
                const paragraphs = [
                    new Paragraph({
                        text: `第${index + 1}条（${article.title}）`,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        text: article.content,
                        spacing: { after: 200 },
                    })
                ];

                // 項がある場合は追加
                if (article.subArticles.length > 0) {
                    article.subArticles.forEach((sub, subIndex) => {
                        paragraphs.push(
                            new Paragraph({
                                text: `${subIndex + 1}. ${sub.content}`,
                                spacing: { after: 200 },
                                indent: { left: 720 }, // インデント
                            })
                        );
                    });
                }

                return paragraphs;
            });

            // 基本情報の段落を生成（入力値がある場合のみ）
            const basicInfoParagraphs = [];

            // 契約期間（開始日と終了日の両方が入力されている場合のみ表示）
            if (contractInfo.startDate && contractInfo.endDate) {
                basicInfoParagraphs.push(
                    new Paragraph({
                        text: `契約期間: ${contractInfo.startDate} ～ ${contractInfo.endDate}`,
                        spacing: { after: 200 },
                    })
                );
            }

            // 契約金額（入力されている場合のみ表示）
            if (contractInfo.amount) {
                basicInfoParagraphs.push(
                    new Paragraph({
                        text: `契約金額: ${Number(contractInfo.amount).toLocaleString()}円`,
                        spacing: { after: 200 },
                    })
                );
            }

            // 支払条件（入力されている場合のみ表示）
            if (contractInfo.paymentTerms.trim()) {
                basicInfoParagraphs.push(
                    new Paragraph({
                        text: `支払条件: ${contractInfo.paymentTerms}`,
                        spacing: { after: 200 },
                    })
                );
            }

            // 特記事項（入力されている場合のみ表示）
            if (contractInfo.specialTerms.trim()) {
                basicInfoParagraphs.push(
                    new Paragraph({
                        text: `特記事項: ${contractInfo.specialTerms}`,
                        spacing: { after: 400 },
                    })
                );
            }

            // 署名欄の生成（チェックボックスの状態に応じて）
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `令和${year - 2018}年${month}月${day}日`;
            };

            const signatureParagraphs = [
                new Paragraph({ text: "", spacing: { after: 400 } }), // 署名欄の前に空行
                new Paragraph({
                    text: formatDate(new Date()),
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 400 },
                }),
            ];

            // 甲（顧客）の署名欄
            if (signatures.showCustomerSignature) {
                signatureParagraphs.push(
                    new Paragraph({ text: "甲", spacing: { after: 200 } }),
                    new Paragraph({ 
                        text: customerInfo.name, 
                        spacing: { after: 200 } 
                    }),
                    new Paragraph({ 
                        text: customerInfo.address || '', 
                        spacing: { after: 400 } 
                    })
                );
            }

            // 乙（自社）の署名欄
            if (signatures.showCompanySignature) {
                signatureParagraphs.push(
                    new Paragraph({ text: "乙", spacing: { after: 200 } }),
                    new Paragraph({ 
                        text: companyInfo.name, 
                        spacing: { after: 200 } 
                    }),
                    new Paragraph({ 
                        text: companyInfo.address || '', 
                        spacing: { after: 200 } 
                    })
                );
            }

            // Wordドキュメントを生成
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: contractTitle,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            text: `${customerInfo.name}（以下「甲」という）と${companyInfo.name}（以下「乙」という）とは、以下のとおり${contractInfo.contractType === 'sales' ? '売買契約' : '業務委託契約'}（以下「本契約」という）を締結する。`,
                            spacing: { after: 400 },
                        }),
                        ...articleParagraphs,
                        ...basicInfoParagraphs,
                        ...signatureParagraphs,
                    ],
                }],
            });

            // ドキュメントを生成してダウンロード
            const blob = await Packer.toBlob(doc);
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${contractTitle}.docx`;
            anchor.click();
            window.URL.revokeObjectURL(url);

            setSuccess(true);
        } catch (err) {
            console.error('Error generating contract:', err);
            setError(err.message);
        }
    };

    return (
        <div className="contract">
            <h1>契約書作成</h1>
            <Card className="contract-card">
                <Stack spacing={3} padding={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>契約種別</InputLabel>
                                <Select
                                    name="contractType"
                                    value={contractInfo.contractType}
                                    onChange={handleChange}
                                    label="契約種別"
                                >
                                    {contractTypes.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="契約書名"
                                name="contractName"
                                value={contractInfo.contractName}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label="契約開始日"
                        type="date"
                        name="startDate"
                        value={contractInfo.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        label="契約終了日"
                        type="date"
                        name="endDate"
                        value={contractInfo.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        label="契約金額"
                        type="number"
                        name="amount"
                        value={contractInfo.amount}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="支払条件"
                        name="paymentTerms"
                        value={contractInfo.paymentTerms}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                    />

                    <TextField
                        label="特記事項"
                        name="specialTerms"
                        value={contractInfo.specialTerms}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                    />

                    <Divider />
                    
                    <Typography variant="h6">署名設定</Typography>
                    <Stack direction="row" spacing={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={signatures.showCustomerSignature}
                                    onChange={handleSignatureChange('showCustomerSignature')}
                                    name="showCustomerSignature"
                                />
                            }
                            label="甲の署名欄を表示（手書き用）"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={signatures.showCompanySignature}
                                    onChange={handleSignatureChange('showCompanySignature')}
                                    name="showCompanySignature"
                                />
                            }
                            label="乙の署名欄を表示（手書き用）"
                        />
                    </Stack>

                    <Divider />
                    
                    <Typography variant="h6">条項</Typography>
                    {articles.map((article, index) => (
                        <Box key={index} sx={{ position: 'relative', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Stack spacing={2}>
                                <TextField
                                    label={`第${index + 1}条の見出し`}
                                    value={article.title}
                                    onChange={(e) => updateArticle(index, 'title', e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="内容"
                                    value={article.content}
                                    onChange={(e) => updateArticle(index, 'content', e.target.value)}
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                                
                                {/* 項の表示 */}
                                {article.subArticles.map((sub, subIndex) => (
                                    <Box key={subIndex} sx={{ ml: 4, position: 'relative' }}>
                                        <TextField
                                            label={`第${index + 1}条第${subIndex + 1}項`}
                                            value={sub.content}
                                            onChange={(e) => updateSubArticle(index, subIndex, e.target.value)}
                                            fullWidth
                                            multiline
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => removeSubArticle(index, subIndex)}
                                            sx={{ position: 'absolute', top: 0, right: -40 }}
                                            color="error"
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                
                                <Button
                                    size="small"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => addSubArticle(index)}
                                    sx={{ alignSelf: 'flex-start', ml: 4 }}
                                >
                                    項を追加
                                </Button>
                            </Stack>
                            
                            {index > 0 && (
                                <IconButton
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => removeArticle(index)}
                                    color="error"
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    
                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={addArticle}
                        variant="outlined"
                    >
                        条項を追加
                    </Button>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={generateContract}
                    >
                        契約書を生成
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
                    契約書が正常に生成されました
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Contract;