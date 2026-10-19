import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#181818', borderTop: '1px solid #333' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body2" color="gray">
          © 2026 ExtraQuest BY. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;