import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './home.css';

const Home = () => {
    return (
        <div className="home">
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
                ビジネス帳票支援ツール
            </Typography>

            <Grid container spacing={3}>
                {/* はじめに */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            はじめに
                        </Typography>
                        <Typography paragraph>
                            本ツールでは、契約書・請求書・見積書などの各種ビジネス文書を簡単に作成することができます。
                            まずは以下の初期設定を行ってください。
                        </Typography>
                    </Paper>
                </Grid>

                {/* 初期設定ガイド */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                初期設定手順
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <BusinessIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="1. 自社情報の設定" 
                                        secondary="ヘッダーの「設定」から自社の情報を登録してください"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <PersonIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="2. 顧客情報の登録" 
                                        secondary="右下の顧客情報ボタンから取引先の情報を登録してください"
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 使用可能な書類 */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                作成可能な書類
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <DescriptionIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="契約書" 
                                        secondary="各種契約書のテンプレートから作成できます"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <DescriptionIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="見積書・請求書・発注書・領収書" 
                                        secondary="取引に必要な基本的な書類を作成できます"
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 使用上の注意 */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, bgcolor: '#fff3e0' }}>
                        <Box display="flex" alignItems="center" mb={1}>
                            <HelpOutlineIcon color="warning" sx={{ mr: 1 }} />
                            <Typography variant="h6" color="warning.dark">
                                ご利用上の注意
                            </Typography>
                        </Box>
                        <Typography color="text.secondary">
                            本ツールで作成される書類は一般的なテンプレートに基づいています。
                            実際の利用時は、必要に応じて専門家への確認をお勧めします。
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;