import React, { Component } from 'react'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import {Container} from 'react-bootstrap'
import {MapContainer, TileLayer} from 'react-leaflet'
import './MapComponentStyles/MapComponent.css'
import 'leaflet/dist/leaflet.css';
import Axios from 'axios'
import { toast,ToastContainer } from 'react-toastify'


export default class MapComponent extends Component {

  constructor()
  {
    super()
    this.state = {latitude: '', longitude: '', isLoading: true, locationName: ''}
  }
  componentDidMount = async() => {
    await this.getLocationCoordinates(this.state.locationName)
  }
  getLocationCoordinates = async (locationName) => {
    
    await Axios.get(`https://nominatim.openstreetmap.org/search.php?q=${locationName}&format=jsonv2`)
    .then((res) => {
        let latitude = res.data[0].lat
        let longitude = res.data[0].lon
        this.setState({'latitude': Number(latitude), 'longitude': Number(longitude)})
        if(this.state.latitude != '' && this.state.longitude != '')
        {
            this.setState({'isLoading' : false})
        }
    })
    .catch((err) => {
        toast.warn('Invalid Location !')
    })
}
  render() {
    return (
      <div>
        <NavbarComponentRegisteredUser/>
        <ToastContainer/>
        {this.state.isLoading == true ? 
        "Loading" : 
        <Container>
            <MapContainer
                center={[this.state.latitude, this.state.longitude]}
                zoom = {20}
                >
                <TileLayer
                    url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </Container>
  }
        <SidebarComponent/>
      </div>
    )
  }
}
