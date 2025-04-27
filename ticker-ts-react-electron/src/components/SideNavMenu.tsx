import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const SideNavMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer} sx={{ position: 'fixed', top: 16, left: 16 }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            <ListItem component={Link} to="/" onClick={toggleDrawer}>
              <HomeIcon sx={{ mr: 2 }} />
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component={Link} to="/account" onClick={toggleDrawer}>
              <AccountCircleIcon sx={{ mr: 2 }} />
              <ListItemText primary="Account" />
            </ListItem>
            <ListItem component={Link} to="/settings" onClick={toggleDrawer}>
              <SettingsIcon sx={{ mr: 2 }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default SideNavMenu;
