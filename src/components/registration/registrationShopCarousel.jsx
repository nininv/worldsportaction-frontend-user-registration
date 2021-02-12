import React, { Component } from "react";
import { Carousel } from 'react-responsive-carousel';
import "./product.css";

class ShopCarousel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { productImgUrl } = this.props.item;

        return (
            <div>
                <Carousel
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop
                    showArrows
                >
                    {Array.apply(null, [productImgUrl, productImgUrl, productImgUrl]).map(
                        (url, index) => {
                            return (
                                <div className="carousel-div" key={index}>
                                    <img style={{height: "100px", width: "100%", objectFit:"contain" }} src={url} className="carousel-img" alt={""} />
                                </div>
                            );
                        }
                    )}
                </Carousel>
            </div>
        )
    }
}

export default ShopCarousel;