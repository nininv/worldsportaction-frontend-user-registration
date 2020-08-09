import React from 'react';
import { Modal, Button } from 'antd';
import AppConstants from "../themes/appConstants"
import "./addCartModal.css";
import AppImages from "../themes/appImages";
import { currencyFormat } from "../util/currencyFormat";
import { isArrayNotEmpty } from "../util/helpers";
import CounterInput from './reactBootstrapCounter';

class AddToCartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



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
        return productItem.tax > 0 ? currencyFormat(price + productItem.tax) : currencyFormat(price)
    }

    render() {
        const { visible, onOk, onCancel, productItem, quantity, quantityOnChange } = this.props
        return (
            <div >
                <Modal
                    {...this.props}
                    closable={false}
                    footer={false}
                    className="add-to-cart-modal"
                    visible={visible}
                    onOk={onOk}
                    onCancel={onCancel}
                    style={{ top: "35%" }}
                >
                    <div className="row" style={{ width: "100%" }} >
                        <div className="w-25 d-flex justify-content-center">
                            <img
                                src={isArrayNotEmpty(productItem.images) ? productItem.images[0].url : AppImages.squareImage}
                                className="product-cart-img"
                                onError={ev => {
                                    ev.target.src = AppImages.squareImage;
                                }}
                            />
                        </div>

                        <div className="w-50 add-cart-name-price-div">
                            <span className="product-name">{productItem.productName}</span>
                            <span className="product-price-text-style">
                                {this.productItemPriceCheck(productItem)}
                            </span>
                        </div>
                        <div className="w-25">
                            <CounterInput
                                value={quantity}
                                min={1}
                                onChange={quantityOnChange}
                                visible={visible}
                            />
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-start" }}>
                            <Button className="cancelBtnWidth" type="cancel-button" onClick={onCancel} style={{ marginRight: '20px' }}
                            >
                                {AppConstants.cancel}
                            </Button>
                        </div>
                        <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                            <Button className="publish-button" type="primary" onClick={onOk} >
                                {AppConstants.confirm}
                            </Button>
                        </div>
                    </div>
                </Modal >
            </div >
        )
    }
}


export default (AddToCartModal);