import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface TickerCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const TickerCheckbox: React.FC<TickerCheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={label}
    />
  );
};

export default TickerCheckbox;
