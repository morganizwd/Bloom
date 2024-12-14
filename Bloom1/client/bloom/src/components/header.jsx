import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../redux/slices/auth';
import logo from '../../src/media/logo.png';
import avatart from '../../src/media/avatar.png';

const pages = [
    { title: 'Категории', path: '/' },
    { title: 'О нас', path: '/about' },
    { title: 'Корзина', path: '/cart' },
    { title: 'Акции', path: '/promotions'},
    { title: 'Избранное', path: '/favorites'},
    { title: 'История заказов', path: '/history'},
    { title: 'Заказы', path: '/orders', adminOnly: true },
    { title: 'Управление категориями', path: '/categories', adminOnly: true },
];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Создаём экземпляр navigate
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);

    const isAdmin = userData && userData.role === 'admin';

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const onClickLogout = () => {
        if (window.confirm('Вы действительно хотите выйти из учетной записи?')) {
            dispatch(logout());
            window.localStorage.removeItem('token');
            navigate('/login'); // Перенаправляем пользователя на страницу логина
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#9ae6c0' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={logo} alt="Logo" style={{ marginRight: '10px', height: '30px' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Bloom
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.filter(page => !page.adminOnly || isAdmin).map((page) => (
                                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                                    <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography textAlign="center">{page.title}</Typography>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.filter(page => !page.adminOnly || isAdmin).map((page) => (
                            <Button
                                key={page.title}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {page.title}
                                </Link>
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <img src={avatart} alt="Logo" style={{ marginRight: '10px', height: '30px' }} />
                            </IconButton>
                        </Tooltip>
                        {isAuth ? (
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={() => { handleCloseUserMenu(); onClickLogout(); }}>
                                    <Typography>Выйти</Typography>
                                </MenuItem>
                            </Menu>
                        ) : (
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to={'/login'} style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                        <Typography>Войти</Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to={'/registration'} style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                        <Typography>Создать аккаунт</Typography>
                                    </Link>
                                </MenuItem>
                            </Menu>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;