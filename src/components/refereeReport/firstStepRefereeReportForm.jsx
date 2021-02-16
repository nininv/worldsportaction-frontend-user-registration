import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Layout,
    Select,
    AutoComplete,
} from "antd";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import * as PropTypes from "prop-types";
import moment from "moment";
import { debounce, isString } from "lodash";
import { useDispatch, useSelector } from "react-redux";

import history from "../../util/history";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import ValidationConstants from "../../themes/validationConstant";
import { getUsersByRoleAction } from "../../store/actions/userAction/userAction";

const { Option } = Select;
const { Footer, Content } = Layout;
const formValidationSchema = Yup.object().shape({
    player: Yup.object()
        .required(ValidationConstants.fieldIsRequired),
    role: Yup.string()
        .min(2, "Role must be at least 2 characters")
        .required(ValidationConstants.fieldIsRequired),
    dateAndTimeIncident: Yup.string()
        .min(2, "This field must be at least 2 characters")
        .required(ValidationConstants.fieldIsRequired),
});
const offencesKey = "offences";

const FirstStepRefereeReportForm = ({ onSubmit, initValues }) => {
    const disptach = useDispatch();
    const commonStore = useSelector((state) => state.CommonReducerState);
    const userStore = useSelector((state) => state.UserState);
    const [isUsersFetching, setIsUsersFetching] = useState(false);
    const [userForSelect, setUsersForSelect] = useState([]);

    const goBack = () => {
        history.push({
            pathname: "/userPersonal",
            state: { tabKey: "5" },
        });
    };

    const isCheckboxChecked = (values, offenceId) => {
        return !!values[offencesKey].find((item) => item.id === offenceId);
    };

    const handleOffenceCheckbox = ({ offence, setFieldValue, formValues }) => {
        const existOffences = formValues[offencesKey];
        const isChecked = existOffences.find(
            (existOffence) => existOffence.id === offence.id
        );

        if (isChecked) {
            const offencesWithoutCurrent = existOffences.filter(
                (item) => item.id !== offence.id
            );
            setFieldValue(offencesKey, offencesWithoutCurrent);
        } else {
            setFieldValue(offencesKey, [...existOffences, offence]);
        }
    };

    const fetchUsersListByName = (userName = "") => {
        disptach(
            getUsersByRoleAction({
                roleId: 5,
                entityTypeId: 1,
                entityId: 806,
                userName,
            })
        );
    };

    const searchUsers = debounce((query) => {
        if (query) {
            setUsersForSelect(['Loading...']);
            fetchUsersListByName(query);
            setIsUsersFetching(true)
        } else {
            setUsersForSelect([]);
            setIsUsersFetching(false)
        }
    }, 500);

    const handleSearchUserName = (query, formProps) => {
        formProps.setFieldValue("player", query);
        searchUsers(query);
    };

    const handleUserNameSelect = (selectedName, formProps) => {
        if (isUsersFetching) return;

        const selectedUser = userStore.userListByRole.find((user) => {
            return user.firstName + " " + user.lastName === selectedName;
        });

        formProps.setFieldValue("player", selectedUser);
    };

    const getUserName = (user) => {
        if (isString(user)) {
            return user;
        }

        return user ? user.firstName + " " + user.lastName : "";
    };

    useEffect(() => {
        const options = userStore.userListByRole.map(getUserName);

        setUsersForSelect(options);
        setIsUsersFetching(false)
    }, [userStore.userListByRole]);

    const contentView = (formProps) => {
        const { values, errors, touched, setFieldValue } = formProps;
        return (
            <Content>
                <div className="formView">
                    <div className="content-view pt-5">
                        <div className="form-group mb-0">
                            <InputWithHead
                                heading={AppConstants.name}
                            />
                            <AutoComplete
                                value={getUserName(values.player)}
                                dataSource={userForSelect}
                                style={{ width: "100%" }}
                                onSelect={(val) =>
                                    handleUserNameSelect(val, formProps)
                                }
                                onSearch={(val) =>
                                    handleSearchUserName(val, formProps)
                                }
                                placeholder={AppConstants.name}
                            />
                            {errors.player && touched.player && (
                                <span className="form-err">
                                    {errors.player}
                                </span>
                            )}
                        </div>

                        <div className="form-group mb-0">
                            <InputWithHead heading={AppConstants.role} />
                            <Select
                                name="role"
                                style={{ width: "100%" }}
                                onChange={(role) => setFieldValue("role", role)}
                                value={values.role}
                            >
                                {userStore.roles.map((role) => (
                                    <Option
                                        key={role.name + role.id}
                                        value={role.name}
                                    >
                                        {" "}
                                        {role.description}
                                    </Option>
                                ))}
                            </Select>
                            {errors.role && touched.role && (
                                <span className="form-err">{errors.role}</span>
                            )}
                        </div>

                        <div className="form-group mb-0">
                            <InputWithHead
                                heading={AppConstants.dateAndTimeIncident}
                                required={"required-field"}
                            />
                            <DatePicker
                                size="large"
                                placeholder="dd-mm-yyyy hh-mm"
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD HH:mm"
                                showTime={true}
                                name="dateAndTimeIncident"
                                onChange={(value, dateString) => {
                                    setFieldValue(
                                        "dateAndTimeIncident",
                                        value
                                    );
                                }}
                                value={
                                    values.dateAndTimeIncident
                                        ? moment(values.dateAndTimeIncident)
                                        : null
                                }
                            />
                            {errors.dateAndTimeIncident &&
                                touched.dateAndTimeIncident && (
                                    <span className="form-err">
                                        {errors.dateAndTimeIncident}
                                    </span>
                                )}
                        </div>

                        <div className="form-group mb-0">
                            <InputWithHead
                                heading={AppConstants.reportOffenceRequired}
                            />
                            {commonStore.refereeOffenceList.map((offence) => {
                                return (
                                    <Checkbox
                                        key={offence.id}
                                        className="single-checkbox pt-3 ml-0 w-100"
                                        checked={isCheckboxChecked(
                                            values,
                                            offence.id
                                        )}
                                        onChange={(e) =>
                                            handleOffenceCheckbox({
                                                offence,
                                                setFieldValue,
                                                formValues: values,
                                            })
                                        }
                                    >
                                        {offence.description}
                                    </Checkbox>
                                );
                            })}
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
                                <Button type="cancel-button" onClick={goBack}>
                                    {AppConstants.cancel}
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
            initialValues={
                initValues || {
                    player: "",
                    role: "Admin",
                    dateAndTimeIncident: moment(new Date()),
                    [offencesKey]: [],
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

FirstStepRefereeReportForm.propTypes = {
    onSubmit: PropTypes.func,
    initValues: PropTypes.object,
};

export default FirstStepRefereeReportForm;
