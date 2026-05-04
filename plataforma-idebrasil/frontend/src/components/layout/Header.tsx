import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle, Business, AdminPanelSettings, Lock } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/perfil');
  };

  const getUserIcon = () => {
    switch (state.user?.tipo) {
      case 'admin':
        return <AdminPanelSettings />;
      case 'empresa':
        return <Business />;
      default:
        return <AccountCircle />;
    }
  };

  const getUserTypeLabel = () => {
    switch (state.user?.tipo) {
      case 'admin':
        return 'Admin';
      case 'empresa':
        return 'Empresa';
      default:
        return 'Usuário';
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        {/* IDEBRASIL Logo - Follows manual de identidade visual */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            textDecoration: 'none',
            gap: 1
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="IDEBRASIL"
            sx={{ height: 36, objectFit: 'contain' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            color="inherit"
            component={Link}
            to="/busca"
            sx={{
              fontWeight: 600,
              color: '#2C2C2C',
              '&:hover': { color: '#C23535' }
            }}
          >
            Buscar Empresas
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/empresa/cadastro"
            sx={{
              fontWeight: 600,
              color: '#2C2C2C',
              '&:hover': { color: '#C23535' }
            }}
          >
            Cadastrar Empresa
          </Button>

          {state.isAuthenticated ? (
            <>
              {state.user?.tipo === 'admin' && (
                <Button
                  variant="contained"
                  component={Link}
                  to="/admin"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: '#C23535', // IDEBRASIL Vermelho 01
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#A52A2A' }
                  }}
                >
                  Admin
                </Button>
              )}

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ color: '#2C2C2C' }}
              >
                {getUserIcon()}
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {getUserTypeLabel()}: {state.user?.nome}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleProfile}>Meu Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{
                  fontWeight: 600,
                  color: '#2C2C2C',
                  '&:hover': { color: '#C23535' }
                }}
              >
                Entrar
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/registro"
                sx={{
                  fontWeight: 600,
                  backgroundColor: '#C23535', // IDEBRASIL Vermelho 01
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#A52A2A' }
                }}
              >
                Cadastrar
              </Button>

              <Tooltip title="Acesso Administrativo">
                <IconButton
                  component={Link}
                  to="/admin/login"
                  size="small"
                  sx={{ color: '#aaa', '&:hover': { color: '#C23535' } }}
                >
                  <Lock fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;