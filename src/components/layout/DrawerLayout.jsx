import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  ExitToApp as LogoutIcon,
  Help as HelpIcon,
  WhereToVote as VoteIcon,
  Menu as MenuIcon,
  AccountCircle,
} from "@material-ui/icons";
import CampaignDialog from "../dialogs/Campaign.dialog";

import { getCampaigns, allCampaigns } from "../../store/campaigns.slice";
import { logout } from "../../store/auth.slice";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  username: { fontSize: "2rem" },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  accountMenuButton: {
    marginRight: theme.spacing(2),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ResponsiveDrawer = ({ title, children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const auth = useSelector((state) => state.auth);
  const campaigns = useSelector((state) => allCampaigns);

  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Typography align="center" className={classes.username}>
          {auth.username}
        </Typography>
      </div>
      <Divider />
      <List subheader={<ListSubheader>Campaigns</ListSubheader>} className={classes.toolbar_bottom}>
        {campaigns.length ? (
          campaigns.map((campaign, index) => (
            <ListItem button key={campaign.name}>
              <ListItemIcon>
                <VoteIcon />
              </ListItemIcon>
              <ListItemText primary={campaign.name} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemIcon>
              <VoteIcon />
            </ListItemIcon>
            <ListItemText primary={campaigns.loading ? "Loading..." : "No campaigns!"} />
          </ListItem>
        )}
        {auth.isModerator && <CampaignDialog />}
      </List>
      <Divider />
      <List subheader={<ListSubheader>User</ListSubheader>} className={classes.toolbar_bottom}>
        <ListItem button component={Link} to="/profile" key="profile" selected={title === "Profile"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to="/help" key="help" selected={title === "Help"}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help and Rules" />
        </ListItem>
        <ListItem
          button
          key="logout"
          onClick={() => {
            dispatch(logout());
            history.push("/auth/logout");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default ResponsiveDrawer;
