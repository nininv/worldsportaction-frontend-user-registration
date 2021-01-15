import React, { Component } from "react";
import { Layout, Breadcrumb, Button, DatePicker } from 'antd';
import history from '../../util/history'

import ScheduleSelector from 'react-schedule-selector';
import moment from 'moment';

import { bindActionCreators } from "redux";
import { connect } from 'react-redux';

import AppConstants from "../../themes/appConstants";

import { getUserRole } from "../../store/actions/userAction/userAction";
import { getUmpireAvailabilityAction, saveUmpireAvailabilityAction } from '../../store/actions/LiveScoreAction/liveScoreUmpireAction';

import { getUserId, getTempUserId, setUserId, setAuthToken, getAuthToken } from "../../util/sessionStorage";

import DashboardLayout from "../../pages/dashboardLayout";

import Loader from '../../customComponents/loader';

import './umpire.css';

const { WeekPicker } = DatePicker;
const { Header, Content } = Layout;

class MyUmpiringAvailability extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: getUserId(),
            loading: false,
            tempUserId: getTempUserId(),
            schedule: null,
            scheduleStartDate: new Date(moment().startOf('week').format()),
            scheduleUnavailableStart: null,
            scheduleUnavailableEnd: null,
        }
    }

    async componentDidMount() {
        let userId = this.state.userId;
        if (this.state.tempUserId != undefined && this.state.tempUserId != null) {
            userId = this.state.tempUserId;
            this.setState({ userId: userId });
            localStorage.removeItem("tempUserId");
        }
        else {
            if (this.props.location && this.props.location.search) {
                const query = this.queryfie(this.props.location.search);
                let token = query.token;
                userId = query.userId;
                if (userId != undefined && token != undefined) {
                    await setUserId(userId);
                    await setAuthToken(token);
                    this.setState({
                        userId: userId
                    })
                }
                else {
                    let authToken = await getAuthToken();
                    let userIdFromStorage = await getUserId();
                    if (userIdFromStorage != undefined && authToken != undefined &&
                        userIdFromStorage != null && authToken != null &&
                        userIdFromStorage != "" && authToken != "" &&
                        userIdFromStorage != 0) {
                        userId = userIdFromStorage;
                        token = authToken;
                    }
                }
                history.push("/myUmpiringAvailability")
            }
        }

        this.apiCalls(userId);

        const scheduleUnavailableStart = moment().subtract(1, 'd').endOf('day');
        const scheduleUnavailableEnd = moment().add(3, 'M').subtract(1, 'd').endOf('day');

        this.setState({ scheduleUnavailableStart, scheduleUnavailableEnd });
    }

    async componentDidUpdate(nextProps) {
        const { liveScoreUmpireState } = this.props;

        const scheduleArray = liveScoreUmpireState.umpireAvailabilitySchedule.map(item => {
            const utcDate = moment(item.startTime, moment.defaultFormat).toDate();
            return new Date(utcDate);
        })

        if (this.props.liveScoreUmpireState.umpireAvailabilitySchedule != nextProps.liveScoreUmpireState.umpireAvailabilitySchedule) {
            this.setState({ schedule: scheduleArray });
        }
        if (this.props.location && this.props.location.search) {
            const query = this.queryfie(this.props.location.search);
            let token = query.token;
            let userId = query.userId;
            if (userId != undefined && token != undefined) {
                await setUserId(userId);
                await setAuthToken(token);
            }
            else {
                let authToken = await getAuthToken();
                let userIdFromStorage = await getUserId();
                if (userIdFromStorage != undefined && authToken != undefined &&
                    userIdFromStorage != null && authToken != null &&
                    userIdFromStorage != "" && authToken != "" &&
                    userIdFromStorage != 0) {
                    userId = userIdFromStorage;
                    token = authToken;
                }
            }
        }

    }

    queryfie(string) {
        return string
            .slice(1)
            .split('&')
            .map(q => q.split('='))
            .reduce((a, c) => { a[c[0]] = c[1]; return a; }, {});
    }

    apiCalls = (userId) => {
        this.props.getUserRole(userId);

        const { startDate, endDate } = this.getStartEndWeekDates(this.state.scheduleStartDate);

        this.props.getUmpireAvailabilityAction(userId, startDate, endDate);
    };

    getStartEndWeekDates = dateFrom => {
        const startDate = dateFrom.toISOString();
        const endDate = new Date(moment(dateFrom).add(7, 'days').format()).toISOString();

        return { startDate, endDate };
    }

    disabledDate = current => {
        const { scheduleUnavailableStart, scheduleUnavailableEnd } = this.state;

        return current && current < scheduleUnavailableStart
            || current && current > scheduleUnavailableEnd;
    }

    handleChangeDate = date => {
        const { userId } = this.state;

        if (date) {
            const { startDate, endDate } = this.getStartEndWeekDates(date.startOf('week'));

            this.props.getUmpireAvailabilityAction(userId, startDate, endDate);
            this.setState({ scheduleStartDate: date.startOf('week') });
        }
    }

    handleChangeSchedule = newSchedule => {
        this.setState({ schedule: newSchedule });
    }

    handleSaveAvailability = () => {
        const { schedule, userId } = this.state;

        const postData = schedule.map(item => ({
            id: null,
            userId,
            startTime: moment(item).format(),
            endTime: moment(item).clone().add(30, 'minutes').format(),
            type: "UNAVAILABLE",
            created_by: userId
        }));

        const { startDate, endDate } = this.getStartEndWeekDates(this.state.scheduleStartDate);
        this.props.saveUmpireAvailabilityAction(postData, userId, startDate, endDate);
    }

    noDataAvailable = () => {
        return (
            <div style={{ display: 'flex' }}>
                <span className="inside-table-view mt-4 ant-tabs">{AppConstants.noDataAvailable}</span>
            </div>
        )
    }

    renderCell = (datetime, selected, refSetter) => {
        const { scheduleUnavailableStart, scheduleUnavailableEnd } = this.state;

        const isDateBeforeStart = moment(datetime).isBefore(scheduleUnavailableStart);
        const isDateAfterEnd = moment(datetime).isAfter(scheduleUnavailableEnd);

        return (
            <div
                ref={refSetter}
                className="availability-cell-wrapper"
            >
                <div
                    className="availability-cell"
                    style={{
                        background: `${isDateBeforeStart || isDateAfterEnd ? '#eee' : selected ? 'rgba(89,154,242,1)' : '#dbedff'}`,
                        cursor: `${isDateBeforeStart || isDateAfterEnd ? 'not-allowed' : 'default'}`
                    }}
                />
            </div>
        )
    }

    headerView = () => {
        return (
            <div className="row mx-0" >
                <div className="col-sm">
                    <Header className="form-header-view" style={{
                        backgroundColor: "transparent",
                        display: "flex", paddingLeft: '0px',
                        alignItems: "center",
                    }} >
                        <Breadcrumb separator=" > ">
                            <div className="breadcrumb-product">{AppConstants.myUmpiringAvailability}</div>
                        </Breadcrumb>
                    </Header >
                </div>
            </div>
        )
    }

    render() {
        const { userRole } = this.props.userState;
        const { schedule, scheduleStartDate } = this.state;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width" >
                            <div className="row mx-0" >

                                <div className="col-sm-12" style={{ backgroundColor: "#f7fafc", }}>
                                    <div>{this.headerView()}</div>
                                    <div className="inside-table-view mt-4" >
                                        {schedule && userRole &&
                                            <>
                                                <div className="row">
                                                    <div className="col-sm-8 inside-table-view d-flex justify-content-center">
                                                        <span className="umpireAvailablityMessage">{AppConstants.please_sel_umpire_unavailable_time}</span>
                                                    </div>
                                                    <div className="col-sm d-flex align-items-center">
                                                        <div className="table-actions">
                                                            <WeekPicker
                                                                onChange={this.handleChangeDate}
                                                                disabledDate={this.disabledDate}
                                                                format={`D/MM - ${moment(scheduleStartDate).endOf('week').format('D/MM')}`}
                                                            />
                                                            <Button
                                                                className="schedule-approval-button"
                                                                type="primary"
                                                                htmlType="submit"
                                                                disabled={false}
                                                                onClick={this.handleSaveAvailability}
                                                                disabled={this.props.liveScoreUmpireState.onLoad}
                                                            >
                                                                {AppConstants.save}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <ScheduleSelector
                                                        selection={schedule}
                                                        numDays={7}
                                                        minTime={8}
                                                        maxTime={22}
                                                        hourlyChunks={2}
                                                        startDate={scheduleStartDate}
                                                        dateFormat='D/M'
                                                        timeFormat='HH:mm'
                                                        onChange={this.handleChangeSchedule}
                                                        renderDateCell={this.renderCell}
                                                    />
                                                </div>
                                            </>
                                        }

                                        {((!schedule && !this.props.liveScoreUmpireState.onLoad) || !userRole) && this.noDataAvailable()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Loader visible={this.props.liveScoreUmpireState.onLoad} />
                    </Content>
                </Layout>
            </div >

        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserRole,
        getUmpireAvailabilityAction,
        saveUmpireAvailabilityAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        userState: state.UserState,
        liveScoreUmpireState: state.LiveScoreUmpireState,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(MyUmpiringAvailability);