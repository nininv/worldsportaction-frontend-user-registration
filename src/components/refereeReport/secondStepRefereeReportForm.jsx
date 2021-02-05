import { Button, Form, Input, Layout } from "antd";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";

const { Footer, Content } = Layout;
const { TextArea } = Input;

const formFieldsKeys = [
    "secondReportFormStepQ1",
    "secondReportFormStepQ2",
    "secondReportFormStepQ3",
    "secondReportFormStepQ4",
    "secondReportFormStepQ5",
    "secondReportFormStepQ6",
];
const getFormValidationSchema = () => {
    const validationSchema = {};
    formFieldsKeys.forEach((formFieldKey) => {
        validationSchema[formFieldKey] = Yup.string()
            .min(2, "Field must be at least 2 characters")
            .required("Field is required");
    });

    return Yup.object().shape(validationSchema);
};
const getInitialFormValues = () => {
    const formFields = {};
    formFieldsKeys.forEach((formFieldKey) => {
        formFields[formFieldKey] = "test";
    });

    return formFields;
};

const SecondStepRefereeReportForm = ({ onSubmit, onGoBack, initValues }) => {

    const contentView = (formProps) => {
        const { values, errors, touched, handleChange, handleBlur } = formProps;
        return (
            <Content>
                <div className="formView">
                    <div className="content-view pt-5">
                        {formFieldsKeys.map((fieldKey, fieldIndex) => {
                            const firstField = fieldIndex === 0;
                            return (
                                <div key={fieldKey} className="form-group mb-0">
                                    <InputWithHead
                                        heading={AppConstants[fieldKey]}
                                        required={`required-field ${
                                            firstField ? "pt-0" : ""
                                        }`}
                                    />
                                    <TextArea
                                        name={fieldKey}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values[fieldKey]}
                                        allowClear
                                    />
                                    {errors[fieldKey] && touched[fieldKey] && (
                                        <span className="form-err">
                                            {errors[fieldKey]}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Content>
        );
    };

    const footerView = () => {
        return (
            <Footer>
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" onClick={onGoBack}>
                                    {AppConstants.back}
                                </Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button
                                    className="publish-button"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {AppConstants.next}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Footer>
        );
    };

    return (
        <Formik
            initialValues={initValues || getInitialFormValues()}
            validationSchema={getFormValidationSchema()}
            onSubmit={onSubmit}
        >
            {(formProps) => (
                <Form onSubmit={formProps.handleSubmit}>
                    {contentView(formProps)}

                    {footerView(formProps)}
                </Form>
            )}
        </Formik>
    );
};

export default SecondStepRefereeReportForm;
