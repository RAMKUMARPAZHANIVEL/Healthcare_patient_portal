import * as React from "react";
import { Box, Typography } from "@mui/material";
import { TextValidator } from "react-material-ui-form-validator";

const Component = React.forwardRef((props, ref) => {
  const {
    mode,
    id,
    name,
    editable,
    label,
    description,
    placeHolder = "Enter notes here...",
    value,
    OnInputChange,
    style,
    sx,
    validators,
    validationMessages,
    dataTestId,
    rows = 3,
    outline = false
  } = props;

  const [inputValue, setInputValue] = React.useState(value || "");

  const border = editable && outline ? "1px solid #9E9E9E !important" : null;
  const borderRadius = editable && outline ? "8px !important" : null;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value);
    if (OnInputChange) OnInputChange({ name, value });
  };

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  if (mode && mode === "view") {
    return (
      <Box ref={ref} sx={{ border, borderRadius }}>
        {label && (
          <Typography variant="subtitle2" fontWeight={600}>
            {label}
          </Typography>
        )}
        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{ mt: 1, whiteSpace: "pre-line" }}
        >
          {value}
        </Typography>
      </Box>
    );
  }

  return (
    <Box ref={ref} sx={{ display: "flex", flexDirection: "column", gap: 0.5, border, borderRadius }} >
      {label && (
        <Typography nowrap="true" variant="labelheader">
          {label}
        </Typography>
      )}
      {description && (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      )}

      <TextValidator
        onChange={handleChange}
        autoComplete="off"
        id={id}
        name={name}
        value={inputValue}
        validators={validators}
        errorMessages={validationMessages}
        placeholder={placeHolder}
        disabled={!editable}
        multiline
        rows={rows}
        style={{ ...style }}
        sx={{
          "& label": { display: "none" },
          maxWidth: 'unset',
          ...sx,
        }}
        inputProps={{ "data-testid": dataTestId }}
      />
    </Box>
  );
});

export default Component;
