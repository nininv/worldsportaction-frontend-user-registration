import React from 'react';
import { Menu } from "antd";
import "./shopSingleProductComponent.css";
import AppImages from "../themes/appImages";
import { currencyFormat } from "../util/currencyFormat";
import { isArrayNotEmpty } from "../util/helpers";

const { SubMenu } = Menu;
class ShopSingleProductComponent extends React.Component {

    productItemPriceCheck = (productItem) => {
        let price = 0
        let variantOptions = isArrayNotEmpty(productItem.variants) ? productItem.variants[0].options : []
        if (isArrayNotEmpty(variantOptions)) {
            price = Math.min.apply(null, variantOptions.map(function (item) {
                return item.properties.price;
            }))
        } else {
            price = productItem.price
        }
        return productItem.tax > 0 ? currencyFormat(price + productItem.tax) + " (inc GST)" : currencyFormat(price)
    }

    render() {
        const { productItem, productOnClick } = this.props
        return (
            <div className="shop-single-prd-main-view mt-3" onClick={productOnClick}>
                <div className="product-img-view">
                    <img
                        src={isArrayNotEmpty(productItem.images) ? productItem.images[0].url : AppImages.squareImage}
                        name={'image'}
                        className="product-img"
                        onError={ev => {
                            ev.target.src = AppImages.squareImage;
                        }}
                    />
                </div>
                <div className="product-text-view">
                    <span className="product-name">{productItem.productName}</span>
                    <span className="product-price-text-style">
                        {isArrayNotEmpty(productItem.variants) ? " From " + this.productItemPriceCheck(productItem) : this.productItemPriceCheck(productItem)}
                    </span>
                </div>
            </div>
        )
    }
}


export default ShopSingleProductComponent;