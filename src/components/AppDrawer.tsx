import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BarChartIcon from "@mui/icons-material/BarChart";

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  onStatisticsClick?: () => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ open, onClose, onStatisticsClick }) => (
  <Drawer
    anchor="left"
    open={open}
    onClose={onClose}
    variant="temporary"
  >
    <List sx={{ width: 240 }}>
      <ListItem disablePadding>
        <ListItemButton onClick={onStatisticsClick}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Statistics" slotProps={{ primary: { fontWeight: 700 } }} />
        </ListItemButton>
      </ListItem>
      {/* Add more menu items here as needed, each with an icon */}
    </List>
  </Drawer>
);

export default AppDrawer;
