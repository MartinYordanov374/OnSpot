import React, { Component } from 'react'
import { Modal, Carousel, CarouselItem } from 'react-bootstrap'
import { Buffer } from 'buffer';
import './Styles/PostImagesModalStyles.css'

export default class PostImagesModalComponent extends Component 
{
  constructor()
  {
    super()
    this.state = 
    {
        images: [],
        isLoading: true
    }
  }

  handleModalClick = (e) => {
    if(e.target.closest('.carousel') == null){
      // Click happened outside of the carousel
      this.props.props.handleImages();
    }
  }

  componentDidMount = () => {
    let selectedImages = this.props.props.selectImages
    this.setState({'images': selectedImages}, () => {
        this.setState({'isLoading': false})
    }) 
  }
  render() {
    if(this.state.isLoading == true )
    {
        return (
           <p>Loading</p>
        )
    }
    else
    {
        return (
            <div  className=" modal modal-backdrop modal-visible">
                <Modal.Dialog onClick={this.handleModalClick} >
                    <Modal.Body className='modalImageContainer'>
                        <Carousel className='carousel' data-mdb-interval="false">
                            {this.state.images && this.state.images.map((image) => {
                                return(
                                     <CarouselItem className='carousel-item'>
                                         <img 
                                            src={
                                            `data: image/png;base64,
                                            ${Buffer.from(image.PostImage.data).toString('base64')}`
                                            }
                                            className = 'PostImageScroller'
                                        />
                                     </CarouselItem>
                                     
                                )
                                
                            })}
                        </Carousel>
                    </Modal.Body>
                </Modal.Dialog>
            </div>
        )
    }
  }
}
