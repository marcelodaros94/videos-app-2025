import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

const companies = [
  "WWE",
  "AEW",
  "NJPW",
  "Stardom",
  "AAA",
  "TNA",
  "CMLL",
  "ROH",
  "Other Promotions",
];

interface SearchBarProps {
  onSearch: (value: string) => void;
  onCompanyChange: (value: string) => void;
}

const SearchBar = ({ onSearch, onCompanyChange }: SearchBarProps) => {
  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    onCompanyChange(event.target.value);
  };

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <TextField
        fullWidth
        label="Buscar"
        placeholder="Título, empresa, show o año..."
        onChange={(event) => onSearch(event.target.value)}
      />
      <FormControl sx={{ minWidth: { sm: 190 } }}>
        <InputLabel id="company-filter-label">Empresa</InputLabel>
        <Select
          labelId="company-filter-label"
          label="Empresa"
          defaultValue=""
          onChange={handleCompanyChange}
        >
          <MenuItem value="">Todas las empresas</MenuItem>
          {companies.map((company) => (
            <MenuItem key={company} value={company}>
              {company}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SearchBar;
