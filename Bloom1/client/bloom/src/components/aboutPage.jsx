import React from 'react';
import { Container, Typography, Paper, Box, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <Container>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    О нас
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    Bloom - Ваш сервис доставки цветов в Могилеве
                </Typography>
                <Grid item xs={5} md={6}>
                    <img
                        src='http://localhost:4444/uploads/element-flower-icon-free-png.png'
                        alt="Bloom - Сервис доставки цветов"
                        style={{ width: '20%', height: 'auto', borderRadius: '8px' }}
                    />
                </Grid>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
                    <Button variant="outlined" color="primary">
                        Перейти в каталог
                    </Button>
                </Link>
                <Box style={{ marginTop: '20px' }}>
                    <Typography paragraph>
                        Добро пожаловать в Bloom! Мы - уникальный сервис доставки цветов,
                        который делает каждый день особенным для жителей Могилева. Наша миссия -
                        доставлять радость и красоту прямо к вашему порогу.
                    </Typography>
                    <Typography paragraph>
                        В Bloom, мы верим, что цветы могут рассказать истории, выразить чувства и
                        создать незабываемые моменты. Наша команда профессионалов собирает каждый букет
                        с любовью и заботой, учитывая все ваши пожелания.
                    </Typography>
                    <Typography paragraph>
                        Уникальность нашего сервиса заключается в индивидуальном подходе к каждому клиенту
                        и возможности создать букет, который идеально подойдет для любого события.
                        Мы предлагаем широкий ассортимент цветов, от классических роз до экзотических орхидей,
                        чтобы каждый мог найти что-то особенное.
                    </Typography>
                    <Typography paragraph>
                        Мы гордимся тем, что можем делиться красотой и ароматом свежих цветов с вами,
                        ваши семьи и друзьями. С Bloom, каждый день становится ярче!
                    </Typography>

                </Box>
            </Paper>
        </Container>
    );
};

export default AboutPage; 