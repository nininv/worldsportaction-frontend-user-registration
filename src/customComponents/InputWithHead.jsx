import React from "react";
import { Input } from "antd";

class InputWithHead extends React.Component {
    render() {
        const {
            heading,
            placeholder,
            name,
            handleBlur,
            onChange,
            type,
            value,
            required,
            setFieldsValue,
            ...otherProps
        } = this.props;
        return (
            <div>
                {heading && (
                    <span
                        className={`input-style-bold ${
                            required ? required : ""
                        }`}
                    >
                        {heading}
                    </span>
                )}
                {placeholder && (
                    <Input
                        className="input"
                        placeholder={placeholder}
                        name={name || "hidden"}
                        // handleChange={(name) => alert(name)}
                        onBlur={handleBlur}
                        onChange={onChange}
                        type={type}
                        value={value}
                        required={required}
                        {...otherProps}
                    />
                )}
            </div>
        );
    }
}

export default InputWithHead;
