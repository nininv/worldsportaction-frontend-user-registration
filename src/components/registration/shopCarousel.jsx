import React, { Component } from "react";
import { Carousel } from 'react-responsive-carousel';
import "./product.css";
import {isArrayNotEmpty} from "../../util/helpers";

class ShopCarousel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { productImgUrl } = this.props.item; // TODO need change productImgUrl to array
        let urlArray;
        if (isArrayNotEmpty(productImgUrl)) {
            urlArray = [...productImgUrl];
        } else {
            urlArray = [productImgUrl];
        }
        return (
            <div>
                <Carousel
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop
                    showArrows
                >
                    {urlArray.map(
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
