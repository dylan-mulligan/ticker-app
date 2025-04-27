import React, {JSX} from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add, Remove, OpenInNew } from '@mui/icons-material';

interface SelectionBoxProps {
  items: string[];
  selectedItems: string[];
  onItemChange: (item: string) => void;
  openInNewWindow: (item: string, isCrypto: boolean) => void;
  getItemIcon: (item: string) => JSX.Element;
  title: string;
  isCrypto: boolean;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({
  items,
  selectedItems,
  onItemChange,
  openInNewWindow,
  getItemIcon,
  title,
  isCrypto,
}) => {
  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {items.map((item) => (
          <Box
            key={item}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #ccc',
              borderRadius: '8px',
              p: 0.5,
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getItemIcon(item)}
              <Typography>{item.charAt(0).toUpperCase() + item.slice(1)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0 }}>
              <IconButton onClick={() => onItemChange(item)} title="Add or remove from main app">
                {selectedItems.includes(item) ? <Remove /> : <Add />}
              </IconButton>
              <IconButton onClick={() => openInNewWindow(item, isCrypto)} title="Open in new window">
                <OpenInNew />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default SelectionBox;
