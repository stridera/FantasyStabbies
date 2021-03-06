import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
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
  ListItemSecondaryAction,
} from "@material-ui/core";
import {
  ExitToApp as LogoutIcon,
  Assistant as ModIcon,
  WhereToVote as VoteIcon,
  AddLocation as VoteAddIcon,
  Menu as MenuIcon,
  // Edit as EditIcon,
  Delete as DeleteIcon,
  AccountCircle,
} from "@material-ui/icons";
import CampaignDialog from "../dialogs/Campaign.dialog";

import { logout } from "../../store/auth.slice";
import { getCampaigns, deleteCampaign as deleteCampaignById } from "../../store/entities/campaigns.slice";

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
  username: { fontSize: "2rem", marginLeft: "auto" },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  accountMenuButton: {
    marginRight: theme.spacing(2),
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ResponsiveDrawer = ({ match, title, children }, ...rest) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const auth = useSelector((state) => state.auth);
  const campaigns = useSelector((state) => state.campaigns);
  const { slug } = match.params;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const deleteCampaign = (id, redirectAfter) => {
    const confirmed = window.confirm(
      "Do you really want to delete this campaign?  It will delete all nominations and votes as well!"
    );
    if (confirmed) {
      dispatch(deleteCampaignById(id));
      if (redirectAfter) history.push("/campaign");
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) return history.push("/");
    if (campaigns.loading) return;

    const minSinceLastUpdate = moment().diff(moment(campaigns.lastUpdate), "minute");
    if (minSinceLastUpdate > 1) dispatch(getCampaigns());
  }, [auth.isAuthenticated, history, campaigns, dispatch]);

  const drawer = (
    <div>
      <div className={classes.toolbar}></div>
      {auth.isModerator && (
        <>
          <List subheader={<ListSubheader>Moderators</ListSubheader>} className={classes.toolbar_bottom}>
            <ListItem button component={Link} to={`/mod`} selected={match.path === "/mod"}>
              <ListItemIcon>
                <ModIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </List>
          <Divider />
        </>
      )}
      <List subheader={<ListSubheader>Campaigns</ListSubheader>} className={classes.toolbar_bottom}>
        <ListItem button component={Link} to="/campaign" key="campaigns" selected={match.path === "/campaign"}>
          <ListItemIcon>
            <VoteIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {campaigns.entities.map((campaign) => (
          <ListItem
            button
            key={campaign.slug}
            component={Link}
            to={`/campaign/${campaign.slug}`}
            selected={slug === campaign.slug}
          >
            <ListItemIcon>
              <VoteIcon />
            </ListItemIcon>
            <ListItemText primary={campaign.campaignName} />
            <ListItemSecondaryAction>
              {/* <IconButton aria-label="edit campaign" edge="end">
                  <EditIcon />
                </IconButton> */}
              <IconButton
                aria-label="delete campaign"
                edge="end"
                onClick={() => deleteCampaign(campaign._id, slug === campaign.slug)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
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
        <ListItem
          button
          key="logout"
          onClick={() => {
            dispatch(logout());
            history.push("/");
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
          <Typography align="center" className={classes.username}>
            {auth.username}
          </Typography>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="navigation">
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
