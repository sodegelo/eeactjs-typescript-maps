 
import '../App.css';
import { AppBar,   IconButton,  Toolbar, Typography } from '@mui/material';
 
import DriveEtaIcon from '@mui/icons-material/DriveEta'
function NavBar() {
  return (
    <div className="App"> 
        <AppBar position="static" enableColorOnDark>
          <Toolbar>
            <IconButton color="inherit" edge="start">
              <DriveEtaIcon/>
            </IconButton>
            <Typography variant="h6"> Delivery App</Typography> 
          </Toolbar>
        </AppBar>  
    </div>
  );
}

export default NavBar;
