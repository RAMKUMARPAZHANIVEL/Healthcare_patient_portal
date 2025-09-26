import { useState, useRef } from "react";
import Popover from "@mui/material/Popover";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function TooltipBanner({
  icon,
  content,
  severity = "info",
  sx = {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const parentRef = useRef(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  // default background
  const bgColor = sx.backgroundColor || "#f7c788";

  // arrow alignment relative to icon
  let arrowLeft = "50%";
  if (anchorEl) {
    const iconBox = anchorEl.getBoundingClientRect();
    const popoverBox = anchorEl.parentElement.getBoundingClientRect();
    arrowLeft = `${iconBox.left + iconBox.width / 2 - popoverBox.left}px`;
  }

  return (
    <div ref={parentRef} style={{ display: "inline-block", position: "relative" }}>
      <IconButton sx={{ p: 0 }} onClick={handleOpen}>{icon}</IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        container={parentRef.current}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              position: "relative",
              borderRadius: 2,
              boxShadow: 3,
              mt: 1.5,
              backgroundColor: bgColor,
              overflow: "visible",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: `10px solid ${bgColor}`,
              },
              ...sx,
            },
          },
        }}
      >
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            m: 0,
            background: "transparent",
            boxShadow: "none",
          }}
        >
          {content}
        </Alert>
      </Popover>
    </div>
  );
}
