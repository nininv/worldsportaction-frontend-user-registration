import React, { Component, Fragment } from "react";
import { Carousel } from 'react-responsive-carousel';
import "./product.css";

class ShopCarousel extends Component {
    constructor(props) {
        super(props);
    }

    itemView = url => (
        <div className="carousel-div" >
            <img 
                style={{height: "100px", objectFit:"contain" }} 
                className="w-100"
                src={url} className="carousel-img" alt={""} 
            />
        </div>
    )

    render() {
        const { item } = this.props;
        const { productImgUrl, orgLogoUrl, productId } = item;

        return (
            <div>
                <Carousel
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop
                    showArrows
                >
                    {!!productImgUrl.length ? 
                        productImgUrl.map(
                            (url, index) => (
                                <Fragment key={productId + index}>
                                    {this.itemView(url)}
                                </Fragment>
                            ))
                        : 
                        <>
                            {this.itemView(orgLogoUrl)}
                        </>
                    }
                </Carousel>
            </div>
        )
    }
}

export default ShopCarousel;
