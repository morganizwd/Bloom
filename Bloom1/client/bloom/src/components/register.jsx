import React from 'react';
import { Button, TextField, Paper, Typography, Container } from '@mui/material';
import { fetchRegister, selectIsAuth } from '../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
            password: '',
            role: 'user',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        const completeValues = { ...values, role: 'user' };
        const data = await dispatch(fetchRegister(completeValues));

        if (!data.payload) {
            return alert('Не удалось зарегестрироваться');
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    };

    console.log('isAuth', isAuth);

    if (isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '30px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography component="h1" variant="h5">
                    Регистрация
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Имя пользователя"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        error={Boolean(errors.userName?.message)} // Используйте errors.userName, если это имя поля
                        helperText={errors.userName?.message}
                        {...register('userName', { required: 'Укажите имя', minLength: { value: 2, message: "Name is too short" } })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type='email'
                        id="email"
                        label="Электронная почта"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        {...register('email', { required: 'Укажите почту' })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        {...register('password', { required: 'Укажите пароль' })}
                    />
                    <Button
                        disabled={!isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                    >
                        Зарегистрироваться
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Уже зарегистрированы?
                        <Link to="/login" style={{ textDecoration: 'none', color: '#3f51b5' }}>
                            Войти
                        </Link>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
};

export default RegistrationPage;