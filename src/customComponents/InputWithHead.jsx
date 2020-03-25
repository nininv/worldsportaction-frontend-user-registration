import React from 'react';
import { Input } from 'antd';

class InputWithHead extends React.Component {

    render() {
        const { heading, placeholder, name, handleBlur, onChange, type, value } = this.props
        return <div >
            {heading &&
                <span className={`input-heading ${this.props.required}`}>{heading}</span>}
            {placeholder &&
                <Input

                    className="input"
                    placeholder={placeholder}
                    name={name}
                    // handleChange={(name) => alert(name)}
                    onBlur={handleBlur}
                    onChange={onChange}
                    type={type}
                    value={value}
                    {...this.props}
                />}
        </div>;
    }
}


export default InputWithHead;