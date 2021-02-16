import { Button, Typography, Form, Input, Layout } from "antd";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import { regexNumberExpression } from "../../util/helpers";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";

const { Footer, Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const formValidationSchema = Yup.object().shape({
    witnesses: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required(ValidationConstants.fieldIsRequired),
            phone: Yup.number()
                .min(10, `${ValidationConstants.mobileLength}`)
                .required(ValidationConstants.fieldIsRequired),
        })
    ),
});

const ThirdStepRefereeReportForm = ({ onSubmit, onGoBack, initValues }) => {
    const addWitness = ({ setValues, values }) => {
        setValues({
            ...values,
            witnesses: [...values.witnesses, { name: "", phone: "" }],
        });
    };

    const deleteWitness = (indexToDelete, { setValues, values }) => {
        setValues({
            ...values,
            witnesses: values.witnesses.filter(
                (_, index) => index !== indexToDelete
            ),
        });
    };

    const getWitnessRowsTemplate = (formProps) => {
        const {
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            setFieldValue,
        } = formProps;

        return values.witnesses.map((witness, witnessIndex) => {
            const firstRow = witnessIndex === 0;
            const witnessErrors =
                errors.witnesses && errors.witnesses[witnessIndex];
            const witnessTouched =
                touched.witnesses && touched.witnesses[witnessIndex];

            return (
                <div className="row" key={witnessIndex}>
                    <div className="col-sm">
                        <div className="form-group mb-0">
                            <InputWithHead
                                name={`witnesses[${witnessIndex}].name`}
                                heading={AppConstants.nameOfWitness}
                                placeholder={AppConstants.nameOfWitness}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.witnesses[witnessIndex].name}
                                required={`required-field ${
                                    firstRow ? "pt-0" : ""
                                }`}
                            />
                            {witnessErrors &&
                                witnessErrors.name &&
                                witnessTouched &&
                                witnessTouched.name && (
                                    <span className="form-err">
                                        {witnessErrors.name}
                                    </span>
                                )}
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className="form-group mb-0">
                            <InputWithHead
                                name={`witnesses[${witnessIndex}].phone`}
                                heading={AppConstants.phoneNumber}
                                placeholder={AppConstants.phoneNumber}
                                onChange={(e) => {
                                    setFieldValue(
                                        `witnesses[${witnessIndex}].phone`,
                                        regexNumberExpression(e.target.value)
                                    );
                                }}
                                onBlur={handleBlur}
                                value={values.witnesses[witnessIndex].phone}
                                required={`required-field ${
                                    firstRow ? "pt-0" : ""
                                }`}
                                maxLength={10}
                            />
                            {witnessErrors &&
                                witnessErrors.phone &&
                                witnessTouched &&
                                witnessTouched.phone && (
                                    <span className="form-err">
                                        {witnessErrors.phone}
                                    </span>
                                )}
                        </div>
                    </div>

                    {!firstRow ? (
                        <div className="col-12 mt-2">
                            <Text
                                className={"remove-row-button"}
                                type="danger"
                                onClick={() =>
                                    deleteWitness(witnessIndex, formProps)
                                }
                            >
                                Delete
                            </Text>
                        </div>
                    ) : null}
                </div>
            );
        });
    };

    const contentView = (formProps) => {
        const { values, errors, touched, handleChange, handleBlur } = formProps;

        return (
            <Content>
                <div className="formView report-form">
                    <div className="content-view pt-5">
                        {getWitnessRowsTemplate(formProps)}

                        <div
                            className="orange-action-txt mt-4"
                            onClick={() => addWitness(formProps)}
                        >
                            +{AppConstants.addWitness}
                        </div>

                        <div className="form-group mb-0">
                            <InputWithHead
                                heading={AppConstants.thirdReportFormStepQ1}
                            />
                            <TextArea
                                name={"thirdReportFormStepQ1"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values["thirdReportFormStepQ1"]}
                                allowClear
                            />
                            {errors["thirdReportFormStepQ1"] &&
                                touched["thirdReportFormStepQ1"] && (
                                    <span className="form-err">
                                        {errors["thirdReportFormStepQ1"]}
                                    </span>
                                )}
                        </div>
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
                                    {AppConstants.submit}
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
            initialValues={
                initValues || {
                    witnesses: [
                        {
                            name: "Test Name",
                            phone: "1234567890",
                        },
                    ],
                    thirdReportFormStepQ1: "test answer",
                }
            }
            validationSchema={formValidationSchema}
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

export default ThirdStepRefereeReportForm;
