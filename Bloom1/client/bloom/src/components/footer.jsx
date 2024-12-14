import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <img src='http://localhost:4444/uploads/element-flower-icon-free-png.png' alt="Logo" height="50" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Bloom
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">
              Телефон: +375 (29) 123-45-67
            </Typography>
            <Typography variant="body1">
              Рабочее время: Пн-Пт 9:00 - 23:00
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">
              Адрес: ул. Цветочная, 7, Могилев, Беларусь
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;