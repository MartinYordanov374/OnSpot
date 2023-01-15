import React, { Component } from 'react'
import {Container} from 'react-bootstrap'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import './MapComponentStyles/MapComponent.css'
import 'leaflet/dist/leaflet.css';
import Axios from 'axios'
import { toast,ToastContainer } from 'react-toastify'
import L from 'leaflet'
import locationDotIcon from '../../Images/location-pin-solid.svg'
const markerIcon = new L.Icon({
    'iconUrl': locationDotIcon,
    iconSize: [24, 40],
    className: 'locationDotMarker'
})
export default class MapComponent extends Component {

  constructor()
  {
    super()
    this.state = {latitude: '', longitude: '', isLoading: true, locationName: ''}
  }
  componentDidMount = async() => {
    this.setState({'locationName': this.props})
    await this.getLocationCoordinates(this.props.props)
  }
  getLocationCoordinates = async (locationName) => {
    
    await Axios.get(`https://nominatim.openstreetmap.org/search.php?q=${locationName}&format=jsonv2`)
    .then((res) => {
        let latitude = res.data[0].lat
        let longitude = res.data[0].lon
        this.setState({'latitude': Number(latitude), 'longitude': Number(longitude)}, () => {
          if(this.state.latitude != '' && this.state.longitude != '')
          {
              this.setState({'isLoading' : false})
          }
        })
    })
    .catch((err) => {
        toast.warn('Invalid Location !')
    })
}
  render() {
    return (
      <div>
        <ToastContainer/>
        {this.state.isLoading == true ? 
        
        <div className='d-flex justify-content-center'>
            <div class="spinner-border text-primary loadingSpinnerWrapper" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
        </div> : 
        <Container>
            <MapContainer
                center={[this.state.latitude, this.state.longitude]}
                zoom = {17}
                >
                <TileLayer
                    url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[this.state.latitude, this.state.longitude]} icon = {markerIcon} >

                </Marker>
            </MapContainer>
        </Container>
  }
      </div>
    )
  }
}
