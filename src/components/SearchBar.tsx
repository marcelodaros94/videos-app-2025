import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    color: "#17212b",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
  },
  "& .MuiInputLabel-root": { color: "#475569" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
  "& .MuiInputBase-input::placeholder": {
    color: "#64748b",
    opacity: 1,
  },
};

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
        placeholder="Buscar video"
        onChange={(event) => onSearch(event.target.value)}
        sx={fieldSx}
      />
      <FormControl sx={{ minWidth: { sm: 190 }, ...fieldSx }}>
        <InputLabel id="company-filter-label">Empresa</InputLabel>
        <Select
          labelId="company-filter-label"
          label="Empresa"
          defaultValue=""
          onChange={handleCompanyChange}
          MenuProps={{
            PaperProps: {
              sx: { backgroundColor: "#ffffff", color: "#17212b" },
            },
          }}
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
