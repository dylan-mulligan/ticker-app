import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

interface SideNavMenuProps {
  topOffset: number;
}

const SideNavMenu: React.FC<SideNavMenuProps> = ({ topOffset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton 
        onClick={toggleDrawer} 
        sx={{ 
          color: 'white', 
          backgroundColor: 'transparent', 
          borderRadius: 0
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { top: `${topOffset}px` } // Apply the top offset
        }}
      >
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
