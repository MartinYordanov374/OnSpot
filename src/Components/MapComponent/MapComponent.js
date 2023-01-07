import React, { Component } from 'react'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import {Container} from 'react-bootstrap'
import {MapContainer, TileLayer} from 'react-leaflet'
import './MapComponentStyles/MapComponent.css'
import 'leaflet/dist/leaflet.css';
export default class MapComponent extends Component {
  render() {
    return (
      <div>
        
        <NavbarComponentRegisteredUser/>
        <Container>
            <MapContainer
                center={[51.505, -0.09]}
                zoom = {10}
            >
                <TileLayer
                    url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </Container>

        <SidebarComponent/>
      </div>
    )
  }
}
