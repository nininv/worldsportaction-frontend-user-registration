import React, { Component } from "react";
import { Modal, Spin } from "antd";



class Loader extends Component {
    /////// render function 
    render() {
        return (
            <Modal
                // title="WSA 1"
                visible={this.props.visible}
                // onOk={this.handleOk}
                // onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered={true}
                width={0}
                height={0}
                closable={false}
                footer={null}

            >
                <Spin tip="Loading..." />

            </Modal>
        );
    }
}

export default Loader;