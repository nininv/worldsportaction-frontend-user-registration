import React, { useEffect, useState } from "react";
import { Breadcrumb, Form, Layout, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

import "../pages/refereeReportPageStyles.css";
import DashboardLayout from "../pages/dashboardLayout";
import AppConstants from "../themes/appConstants";
import Loader from "../customComponents/loader";
import { getRefereeOffenceListAction } from "../store/actions/commonAction/commonAction";
import FirstStepRefereeReportForm from "../components/refereeReport/firstStepRefereeReportForm";
import SecondStepRefereeReportForm from "../components/refereeReport/secondStepRefereeReportForm";
import ThirdStepRefereeReportForm from "../components/refereeReport/thirdStepRefereeReportForm";
import { createRefereeReportAction } from "../store/actions/LiveScoreAction/liveScoreAction";
import { getRoleAction } from "../store/actions/userAction/userAction";
import { setAuthToken } from "../util/sessionStorage";

const { Header } = Layout;
const { Step } = Steps;
const STEPS_LENGTH = 2;

const RefereeReportPage = (props) => {
    const dispatch = useDispatch();
    const commonStore = useSelector((state) => state.CommonReducerState);
    const liveScoreStore = useSelector((state) => state.LiveScoreState);
    const [currentStep, setCurrentStep] = useState(0);
    const [stepsData, setStepsData] = useState({});

    const { refereeOffenceList } = commonStore;
    const { location } = props;
    const { matchId, userId, competitionId, token } = queryString.parse(
        location.search
    );

    const finishForm = (formData) => {
        let data = {};
        data.userId = +userId;
        data.matchId = +matchId;
        data.competitionId = +competitionId;

        Object.keys(formData).forEach((stepKey) => {
            const stepValue = formData[stepKey];

            switch (+stepKey) {
                case 0: {
                    data = {
                        ...data,
                        foulPlayerId: +stepValue.player.id,
                        foulPlayerRole: stepValue.role,
                        incidentTime: stepValue.dateAndTimeIncident,
                        offences: stepValue.offences,
                    };
                    break;
                }
                case 1: {
                    const QAndAFromStep2 = Object.keys(stepValue).map(
                        (key) => ({
                            question: AppConstants[key],
                            answer: stepValue[key],
                        })
                    );

                    data = {
                        ...data,
                        clarifyingQuestions: QAndAFromStep2,
                    };
                    break;
                }
                case 2:
                    const currentQuestions = data.clarifyingQuestions || [];
                    data = {
                        ...data,
                        clarifyingQuestions: [
                            ...currentQuestions,
                            {
                                question: AppConstants.thirdReportFormStepQ1,
                                answer: stepValue.thirdReportFormStepQ1,
                            },
                        ],
                        witnesses: stepValue.witnesses,
                    };
                    break;
                default:
                    data = { ...data, ...formData[stepKey] };
            }
        });

        dispatch(createRefereeReportAction(data));
    };

    const handleStepSubmit = (currentStepValues) => {
        const newStepsData = {
            ...stepsData,
            [currentStep]: currentStepValues,
        };
        setStepsData(newStepsData);
        if (STEPS_LENGTH > currentStep) {
            setCurrentStep(currentStep + 1);
        } else {
            finishForm(newStepsData);
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const stepsContentView = () => {
        if (currentStep === 0) {
            return (
                <FirstStepRefereeReportForm
                    onSubmit={handleStepSubmit}
                    initValues={stepsData[currentStep]}
                />
            );
        }
        if (currentStep === 1) {
            return (
                <SecondStepRefereeReportForm
                    onSubmit={handleStepSubmit}
                    onGoBack={goBack}
                    initValues={stepsData[currentStep]}
                />
            );
        }
        if (currentStep === 2) {
            return (
                <ThirdStepRefereeReportForm
                    onSubmit={handleStepSubmit}
                    onGoBack={goBack}
                    initValues={stepsData[currentStep]}
                />
            );
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(getRefereeOffenceListAction());
        dispatch(getRoleAction());
    }, []);

    const headerView = () => {
        return (
            <div>
                <div className="header-view">
                    <Header
                        className="form-header-view"
                        style={{
                            backgroundColor: "transparent",
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <Breadcrumb
                            style={{
                                alignItems: "center",
                                alignSelf: "center",
                            }}
                            separator=">"
                        >
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.reportFouls}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Header>
                </div>

                <div className="form__steps">
                    <div className="row">
                        <div className="col-sm">
                            <Steps
                                className="report-steps"
                                current={currentStep}
                            >
                                <Step
                                    title={AppConstants.firstReportFormStep}
                                />
                                <Step
                                    title={AppConstants.secondReportFormStep}
                                />
                                <Step
                                    title={AppConstants.reportFormThirdStep}
                                />
                            </Steps>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="report-page">
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuName={AppConstants.registration} />
                <Loader visible={liveScoreStore.onLoad || commonStore.onLoad} />
                <Layout>
                    {headerView()}
                    {stepsContentView()}
                </Layout>
            </div>
        </div>
    );
};

export default Form.create()(RefereeReportPage);
