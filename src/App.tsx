import React, { useEffect, useRef,useState } from 'react'; 
import './App.css';
import {   CssBaseline,  Grid,  Button,  MenuItem, Select,  ThemeProvider } from '@mui/material';
import theme from './theme'; 
import NavBar from './components/NavBar';
import {styled} from '@mui/material/styles';
import {Loader} from 'google-maps'; 
import { getCurrentPosition } from './utils/geolocation';
import axios  from 'axios';
import {makeCarIcon,makeMarkerIcon,  Map} from './utils/map';
import {sample, shuffle} from 'lodash';
import { Socket, connect as ioConnect} from 'socket.io-client';

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
  "#667788",
  "#124c4c",
  "#300000" 
]



type Position = {lat:number, lng:number};

type Route = {
  id: string;
  title: string;
  startPosition: Position;
  endPosition: Position;
  points: Position[];

}

const Form = styled('form')(({theme})=>({mergin: theme.spacing(1)}));
const GOOGLE_MAPS_API_KEY = "AIzaSyDj4qW6ItUvQ75gGiBZZQbAwSaei0ZlHDM";
const loader = new Loader(GOOGLE_MAPS_API_KEY);

function App() {

  const mapRef = useRef<Map>()
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeSelected, setRouteSelected] = useState<Route | null>(null);
  useEffect(() => {
    (async ()=>{
      await loader.load();
      const position = await getCurrentPosition({enableHighAccuracy:true});
      const divMap = document.getElementById('map') as HTMLDivElement;
      mapRef.current = new Map(divMap, {zoom:15, center: position});
    })(); 
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/routes")
      .then((res )=> {setRoutes(res.data);});
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const color = sample(shuffle(colors)) as string;

    mapRef.current?.addPath(
      routeSelected!.id,
      {
        title: `Rota ${routeSelected!.title}`,
        position: {
          lat: routeSelected!.startPosition.lat,
          lng: routeSelected!.startPosition.lng,
        },
        icon: makeCarIcon(color)
      },
      {
        title: `Rota ${routeSelected!.title}`,
        position: {
          lat: routeSelected!.endPosition.lat,
          lng: routeSelected!.endPosition.lng,
        },
        icon: makeMarkerIcon(color)
      }

    )

  }
  
  return (
    <div className='Route-Conteiner'>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <NavBar/>
        <Grid container className="Route-Block-1">
          <Grid item xs={12} sm={3}>
            <Form onSubmit={onSubmit}>
              <Select fullWidth displayEmpty defaultValue={""}
                      onChange={(e)=>{ 
                        if(e.target.value !== ""){
                          let route = routes.find( r  => r.id === e.target.value) ;
                          if(route !== undefined){
                            setRouteSelected(route); 
                          }  
                        }
                         
                      }}>
                <MenuItem value="0">
                   Selecione uma rota 
                </MenuItem>
                {routes && routes.map((route, index) => (
                  <MenuItem key={index} value={route.id} >
                    {route.title}
                  </MenuItem>
                ))} 
              </Select>
              <div style={{textAlign:'center', margin:theme.spacing(1)}}>
                <Button type="submit" variant="contained">
                  Iniciar rota
                </Button>
              </div>
              
            </Form>
          </Grid>
          <Grid item xs={12} sm={9}>
            <div id="map" className="Map-Container">

            </div>
          </Grid> 
        </Grid>
      </ThemeProvider>
     
    </div>
  );
}

export default App;
