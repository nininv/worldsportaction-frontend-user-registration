import { Breadcrumb, Layout, Select, Form, Table } from 'antd';
import React, { Component } from "react";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { liveScore_MatchFormate } from '../../themes/dateformate'
import { connect } from 'react-redux';
import InputWithHead from "../../customComponents/InputWithHead"
import { bindActionCreators } from 'redux';
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { liveScoreRoundListAction, clearRoundData } from '../../store/actions/LiveScoreAction/liveScoreRoundAction'
// import Loader from '../../customComponents/loader'
import { getliveScoreOrgID, setAuthToken, setUserId, setliveScoreOrgID } from '../../util/sessionStorage'
import AppImages from "../../themes/appImages";
import { fixtureCompetitionListAction } from "../../store/actions/LiveScoreAction/LiveScoreFixtureAction"
import { isArrayNotEmpty, getCurrentYear } from "../../util/helpers";
import history from "../../util/history";
import './liveScore.css'
import { getYearListing } from "../../store/actions/appAction";
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
import { getAllOrganisationListAction } from "../../store/actions/userAction/userAction";

const { Content } = Layout;
const { Option } = Select;
const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c95d69a0e179191e4422d8df456c7dc7268069d560e9e677eb64ca0d506751ea12c34b087a73bc319ba9b17a67ffc69fde351109f091cb2e64e6a60042bcbb11bf6d73e2be792c9658cc5604e115967a82eb0f2f944a1e2950e0116df2065b0ba2fb5dcf34f9341f6b7b6f2e64839339d24123ea015526f05fe22cec9cf96aa86ff990588beafbc3675f550605d72d25247';
const userId = 0
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}


function matchResultImag(result) {
    if (result == "FINAL") {
        return AppImages.greenDot
    } else if (result == "UNCONFIRMED") {
        return AppImages.purpleDot
    } else if (result == "DISPUTE") {
        return AppImages.redDot
    } else {
        return AppImages.greenDot
    }

}
let this_obj = null;


const columns2 = [

    {
        title: 'Date/Time',
        dataIndex: 'startTime',
        // key: 'startTime',

        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime, record, index) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style pl-3" style={{ borderBottom: " 1px solid #e8e8e8" }}>
                            <span className="inner-table-row-heading-text">{record.roundName}</span>
                        </div>
                        <div className="table-live-score-table-fixture-style pl-3"  >
                            <span  >{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
                        </div>
                    </div >

                )
            } else {
                return (
                    <div className="pl-3">
                        <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
                    </div>
                )
            }
        },
    },
    {
        title: 'Home Team',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        render: (team1, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            {/* <NavLink to={{
                                pathname: '/liveScoreTeamView',
                                state: { tableRecord: team1, screenName: 'fromMatchList' }
                            }} > */}
                            <span  >{team1 ? team1.name : ""}</span>
                            {/* </NavLink> */}
                        </div>
                    </div >

                )
            } else {

                return (
                    // <NavLink to={{
                    //     pathname: '/liveScoreTeamView',
                    //     state: { tableRecord: team1, screenName: 'fromMatchList' }
                    // }} >
                    <span  >{team1 ? team1.name : ""}</span>
                    // </NavLink>
                )
            }
        }
    },
    {
        title: 'Away Team',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, "team2"),
        render: (team2, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            {/* <NavLink to={{
                                pathname: '/liveScoreTeamView',
                                state: { tableRecord: team2, screenName: 'fromMatchList' }
                            }} > */}
                            <span>{team2 ? team2.name : ""}</span>
                            {/* </NavLink> */}
                        </div>
                    </div >

                )
            } else {

                return (
                    // <NavLink to={{
                    //     pathname: '/liveScoreTeamView',
                    //     state: { tableRecord: team2, screenName: 'fromMatchList' }
                    // }} >
                    <span  >{team2 ? team2.name : ""}</span>
                    // </NavLink>
                )
            }
        }
    },


    {
        title: 'Venue',
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: (a, b) => tableSort(a, b, "venueCourt"),
        render: (venueCourt, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <span >{this_obj.getVenueName(record, venueCourt)}</span>
                        </div>
                    </div >

                )
            } else {

                return (
                    <span>{this_obj.getVenueName(record, venueCourt)}</span>
                )
            }
        }
    },

    {
        title: 'Match Result',
        dataIndex: 'resultStatus',
        key: 'resultStatus',
        sorter: (a, b) => tableSort(a, b, "resultStatus"),
        render: (matchStatus, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <span>{record ? record.team1Score + " : " + record.team2Score : ""}</span>
                        </div>
                    </div >

                )
            } else {

                return (
                    <span>{record ? record.team1Score + " : " + record.team2Score : ""}</span>
                )
            }
        }

    },
    {
        title: 'Match Status',
        dataIndex: 'resultStatus',
        key: 'resultStatus',
        sorter: (a, b) => tableSort(a, b, "resultStatus"),
        render: (resultStatus, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                                <img className="dot-image"
                                    src={matchResultImag(resultStatus)}
                                    alt="" width="12" height="12" />
                            </span>
                        </div>
                    </div >

                )
            } else {

                return (
                    <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                        <img className="dot-image"
                            src={matchResultImag(resultStatus)}
                            alt="" width="12" height="12" />
                    </span>
                )
            }
        }

    },

];




class LiveScoreSeasonFixture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            division: "",
            grade: "all",
            teams: "all",
            value: "periods",
            gameTimeTracking: false,
            onCompLoad: false,
            onDivisionLoad: false,
            selectedComp: null,
            yearId: null,
            yearLoading: false,
            team: "All",
            onTeamLoad: false,
            filterOrganisationUniqueKey: null,
            orgLoading: false,
        }
        let orgParam = this.props.location.search.split("?organisationKey=")
        let orgId = orgParam[1]
        if (orgId != undefined) {
            setliveScoreOrgID(orgId)
            history.push('/liveScoreSeasonFixture')
        }
        this_obj = this;
    }
    async componentDidMount() {
        this.props.getYearListing(this.props.appState)
        this.props.getAllOrganisationListAction()
        this.setState({ yearLoading: true, orgLoading: true })
        setUserId(userId);
        setAuthToken(token);
    }

    async componentDidUpdate(nextProps) {

        if (nextProps.appState !== this.props.appState) {
            if (this.props.appState.onLoad === false && this.state.yearLoading === true) {
                let yearId = await getCurrentYear(this.props.appState.yearListing)
                this.setState({ yearLoading: false, yearId })
            }
        }

        if (nextProps.userState !== this.props.userState) {
            if (this.props.userState.onLoad === false && this.state.orgLoading === true) {
                let filterOrganisationUniqueKey = this.props.userState.allOrganisationList[0].organisationUniqueKey
                let orgId = await getliveScoreOrgID()
                filterOrganisationUniqueKey = orgId !== undefined ? orgId : filterOrganisationUniqueKey
                setliveScoreOrgID(filterOrganisationUniqueKey)
                if (filterOrganisationUniqueKey != undefined) {
                    this.props.fixtureCompetitionListAction(filterOrganisationUniqueKey, this.state.yearId)
                    this.setState({ onCompLoad: true, orgLoading: false, filterOrganisationUniqueKey })
                } else {
                    history.push('/liveScoreSeasonFixture')
                }
            }
        }


        if (nextProps.liveScoreFixturCompState !== this.props.liveScoreFixturCompState) {
            if (this.state.onCompLoad == true && this.props.liveScoreFixturCompState.onLoad == false) {
                if (isArrayNotEmpty(this.props.liveScoreFixturCompState.comptitionList)) {
                    let firstComp = this.props.liveScoreFixturCompState.comptitionList && this.props.liveScoreFixturCompState.comptitionList[0].id
                    this.props.getLiveScoreDivisionList(firstComp)
                    this.setState({ selectedComp: firstComp, onCompLoad: false, onDivisionLoad: true })
                }
            }
        }



        if (this.props.liveScoreLadderState !== nextProps.liveScoreLadderState) {
            if (this.props.liveScoreLadderState.onLoad == false && this.state.onDivisionLoad == true) {

                if (this.props.liveScoreLadderState.liveScoreLadderDivisionData.length > 0) {
                    let division = this.props.liveScoreLadderState.liveScoreLadderDivisionData[0].id
                    this.setState({ onDivisionLoad: false, division })
                    this.props.getliveScoreTeams(this.state.selectedComp, division)
                    this.props.liveScoreRoundListAction(this.state.selectedComp, division, this.state.team)
                    // this.props.liveScoreLaddersListAction(this.state.selectedComp, division, this.state.competitionUniqueKey)
                }
            }
        }
    }

    onChangeOrg(filterOrganisationUniqueKey) {
        setliveScoreOrgID(filterOrganisationUniqueKey)
        this.props.clearRoundData("all")
        this.props.fixtureCompetitionListAction(filterOrganisationUniqueKey, this.state.yearId)
        this.setState({ filterOrganisationUniqueKey, division: null, competitionUniqueKey: null, onCompLoad: true, selectedComp: null })

    }


    onChangeComp(compID) {
        let selectedComp = compID.comp
        this.props.clearRoundData("all")
        this.props.getLiveScoreDivisionList(selectedComp)
        this.setState({ selectedComp, onDivisionLoad: true, division: null, team: "All" })

    }

    changeDivision(divisionId) {
        let division = divisionId.division
        this.props.liveScoreRoundListAction(this.state.selectedComp, division, this.state.team)
        this.props.getliveScoreTeams(this.state.selectedComp, division)
        this.props.clearRoundData("round")
        this.setState({ division, team: "All" })
    }

    changeTeam(teamId) {
        let team = teamId
        this.props.liveScoreRoundListAction(this.state.selectedComp, this.state.division, team)
        this.props.clearRoundData("round")
        this.setState({ team })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (

            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.seasonFixture}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    getVenueName = (record, venueCourt) => {
        if (record?.team1?.name == "Bye" || record?.team2?.name == "Bye") {
            return ""
        }
        else {
            let venueName = venueCourt ? venueCourt.venue.shortName + "-" + venueCourt.name : ""
            return venueName
        }
    }

    async setYearId(yearId) {
        this.setState({ yearId, onCompLoad: true, selectedComp: null, division: null, team: "All" })
        this.props.clearRoundData("all")
        let organisationId = await getliveScoreOrgID()
        if (organisationId != undefined) {
            this.props.fixtureCompetitionListAction(organisationId, yearId)
            // this.setState({ onCompLoad: true, yearLoading: false, yearId })
        } else {

            history.push('/liveScorePublicLadder')
        }
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { liveScoreLadderState } = this.props;
        let competition = this.props.liveScoreFixturCompState.comptitionList ? this.props.liveScoreFixturCompState.comptitionList : []
        let division = isArrayNotEmpty(liveScoreLadderState.liveScoreLadderDivisionData) ? liveScoreLadderState.liveScoreLadderDivisionData : []
        let teamList = isArrayNotEmpty(liveScoreLadderState.teamResult) ? liveScoreLadderState.teamResult : []
        const { yearListing } = this.props.appState
        const { allOrganisationList } = this.props.userState
        return (
            <>
                <div className="comp-player-grades-header-drop-down-view tableViewHide">
                    <div className="row" >

                        <div className="col-sm-2 mt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                            <span className="year-select-heading">
                                {AppConstants.year}:</span>
                            <Select
                                className="year-select reg-filter-select-year ml-2"
                                style={{ width: 90 }}
                                onChange={yearId => this.setYearId(yearId)}
                                value={this.state.yearId}
                            >
                                {yearListing.length > 0 && yearListing.map((item, yearIndex) => (
                                    < Option key={"yearlist" + yearIndex} value={item.id} > {item.name}</Option>
                                ))
                                }
                            </Select>
                        </div>

                        <div className="col-sm mt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                            <span className="year-select-heading">
                                {AppConstants.organisation}:</span>
                            <Select
                                className="year-select reg-filter-select-competition ml-2"
                                style={{ width: 160 }}
                                onChange={organisationUniqueKey => this.onChangeOrg(organisationUniqueKey)}
                                value={this.state.filterOrganisationUniqueKey}
                            >
                                {allOrganisationList.length > 0 && allOrganisationList.map((item, index) => (
                                    < Option key={"allOrganisation_List" + index} value={item.organisationUniqueKey} > {item.name}</Option>
                                ))
                                }
                            </Select>
                        </div>

                        <div className="col-sm mt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                            <span className='year-select-heading'>{AppConstants.competition}:</span>
                            <Select
                                className="year-select reg-filter-select-competition ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >{
                                    competition.map((item) => {
                                        return <Option value={item.id}>{item.longName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="col-sm mt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }}>
                            <span className='year-select-heading'>{AppConstants.division}:</span>
                            <Select
                                className="year-select reg-filter-select-competition ml-2"
                                style={{ minWidth: 100 }}
                                onChange={(division) => this.changeDivision({ division })}
                                value={this.state.division}
                            >{
                                    division.map((item) => {
                                        return <Option value={item.id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    <div className="row mt-2" >

                        {/* Team List */}
                        <div className="col-sm mt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }}>
                            <span className='year-select-heading'>{AppConstants.team}:</span>
                            <Select
                                className="year-select reg-filter-select-competition ml-2"
                                onChange={(team) => this.changeTeam([team])}
                                value={this.state.team}
                            >
                                <Option value={"All"}>{"All"}</Option>
                                {
                                    teamList.map((item) => {
                                        return <Option value={item.id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>


                    </div>
                </div>
                <div className="comp-player-grades-header-drop-down-view tableViewShow">

                    <div className="col-sm pl-0" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <span className="year-select-heading pl-3">
                            {AppConstants.year}</span>
                    </div>
                    <div className="col-sm pl-0 pt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <Select
                            className="year-select reg-filter-select-year ml-2"
                            style={{ width: 90 }}
                            onChange={yearId => this.setYearId(yearId)}
                            value={this.state.yearId}
                        >
                            {yearListing.length > 0 && yearListing.map((item, yearIndex) => (
                                < Option key={"yearlist" + yearIndex} value={item.id} > {item.name}</Option>
                            ))
                            }
                        </Select>
                    </div>
                    <div className="col-sm pl-0" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <span className='year-select-heading pl-3 pt-2'>{AppConstants.organisation}</span>
                    </div>
                    <div className="col-sm pl-0 pt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <Select
                            className="year-select reg-filter-select-competition ml-2"
                            style={{ minWidth: 160 }}
                            onChange={organisationUniqueKey => this.onChangeOrg(organisationUniqueKey)}
                            value={this.state.filterOrganisationUniqueKey}
                        >
                            {allOrganisationList.length > 0 && allOrganisationList.map((item, index) => (
                                < Option key={"allOrganisation_List" + index} value={item.organisationUniqueKey} > {item.name}</Option>
                            ))
                            }
                        </Select>
                    </div>
                    <div className="col-sm pl-0" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <span className='year-select-heading pl-3 pt-2'>{AppConstants.competition}</span>
                    </div>
                    <div className="col-sm pl-0 pt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <Select
                            className="year-select reg-filter-select-competition ml-2"
                            style={{ minWidth: 160 }}
                            onChange={(comp) => this.onChangeComp({ comp })}
                            value={this.state.selectedComp}
                        >{
                                competition.map((item) => {
                                    return <Option value={item.id}>{item.longName}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="col-sm pl-0" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <span className='year-select-heading pl-3 pt-2'>{AppConstants.division}</span>
                    </div>
                    <div className="col-sm pl-0 pt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <Select
                            className="year-select reg-filter-select-competition ml-2"
                            style={{ minWidth: 100 }}
                            onChange={(division) => this.changeDivision({ division })}
                            value={this.state.division}
                        >{
                                division.map((item) => {
                                    return <Option value={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>

                    {/* Team List */}

                    <div className="col-sm pl-0" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <span className='year-select-heading pl-3 pt-2'>{AppConstants.team}</span>
                    </div>
                    <div className="col-sm pl-0 pt-2" style={{ width: "fit-content", display: "flex", alignItems: "center" }} >
                        <Select
                            className="year-select reg-filter-select-competition ml-2"
                            onChange={(team) => this.changeTeam([team])}
                            value={this.state.team}

                        >
                            <Option value={"All"}>{"All"}</Option>
                            {
                                teamList.map((item) => {
                                    return <Option value={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
            </>
        )
    }
    createRoundsArray(array) {
        let finalArray = []
        if (isArrayNotEmpty(array)) {
            for (let i in array) {
                let matcheArray = array[i].matches
                for (let j in matcheArray) {
                    if (j == 0) {
                        matcheArray[j]["isRoundChnage"] = true
                    }
                    matcheArray[j]["roundName"] = array[i].name
                    matcheArray[j]["roundId"] = array[i].id
                    finalArray.push(matcheArray[j])
                }
            }
        }

        return finalArray
    }



    ////////form content view
    contentView = () => {

        let roundsArray = this.props.liveScoreRoundState.roundList
        let newArray = this.createRoundsArray(roundsArray)
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view tableViewHide">

                    <Table
                        className="livescore-seasonfixture-table"
                        columns={columns2}
                        dataSource={newArray}
                        size="small"
                        pagination={false}
                        loading={this.props.liveScoreRoundState.onLoad}
                    />

                </div>
                <div className="tableViewShow">
                    {newArray.length > 0 && newArray.map((item, index) => {
                        return (
                            <>
                                <>
                                    {item.isRoundChnage &&
                                        <span className="inner-table-row-heading-text">{item.roundName}</span>
                                    }
                                </>
                                <div className="table-responsive" style={{ backgroundColor: "#ffffff" }}>
                                    <div className="tableViewSeasonFixture">
                                        <div style={{ width: '50%' }}>
                                            <InputWithHead heading={AppConstants.dateTime} /></div>
                                        <div style={{ width: '50%' }}>
                                            <InputWithHead className="input-inside-table-fees" heading={item.startTime ? liveScore_MatchFormate(item.startTime) : ""}>
                                            </InputWithHead>
                                        </div>
                                    </div>
                                    <div className='tableViewSeasonFixture'>
                                        <div style={{ width: '50%' }}><InputWithHead heading={AppConstants.homeTeam} /></div>
                                        <div style={{ width: '50%' }}>
                                            <InputWithHead className="input-inside-table-fees" heading={item.team1 ? item.team1.name : ""}>
                                            </InputWithHead>
                                        </div>
                                    </div>
                                    <div className='tableViewSeasonFixture'>
                                        <div style={{ width: '50%' }}><InputWithHead heading={AppConstants.awayTeam} /></div>
                                        <div style={{ width: '50%' }}>
                                            <InputWithHead className="input-inside-table-fees" heading={item.team2 ? item.team2.name : ""}>
                                            </InputWithHead>
                                        </div>
                                    </div>
                                    {item.team1 && item?.team1?.name !== 'Bye' && item.team2 && item?.team2?.name !== 'Bye' &&
                                        < div className='tableViewSeasonFixture'>
                                            <div style={{ width: '50%' }}><InputWithHead heading={AppConstants.venue} /></div>
                                            <div style={{ width: '50%' }}>
                                                <InputWithHead className="input-inside-table-fees" heading={item.venueCourt ? item.venueCourt?.venue?.shortName + "-" + item.venueCourt?.name : ""}>
                                                </InputWithHead>
                                            </div>
                                        </div>
                                    }
                                    <div className='tableViewSeasonFixture'>
                                        <div style={{ width: '50%' }}><InputWithHead heading={AppConstants.matchResult} /></div>
                                        <div style={{ width: '50%' }}>
                                            <InputWithHead className="input-inside-table-fees" heading={item.team1Score + " : " + item.team2Score}>
                                            </InputWithHead>
                                        </div>
                                    </div>
                                    <div className='tableViewSeasonFixture'>
                                        <div style={{ width: '50%' }}><InputWithHead heading={AppConstants.matchStatus} /></div>
                                        <div style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
                                            <img className="dot-image"
                                                src={matchResultImag(item.resultStatus)}
                                                alt="" width="12" height="12" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })}

                </div>
            </div >

        )
    }

    detailsContainer = (icon, description) => {
        return (
            <div className='pt-2'>
                <img src={icon} alt="" width="15" height="15" />
                <span style={{ marginLeft: 10 }} >{description}</span>
            </div >
        )
    }

    footerView() {
        return (

            <div className="comp-player-grades-header-drop-down-view pt-0">
                <span className="applicable-to-heading">{AppConstants.matchStatus}</span>
                <div className="reg-competition-radio">
                    {this.detailsContainer(AppImages.greenDot, AppConstants.final_description)}
                    {this.detailsContainer(AppImages.purpleDot, AppConstants.draft_description)}
                    {this.detailsContainer(AppImages.redDot, AppConstants.dispute_description)}
                </div>
            </div>

        )
    }



    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScoreSeasonFixture} />
                {/* <Loader visible={this.props.liveScoreFixturCompState.onLoad || this.props.liveScoreMatchState.onLoad} /> */}
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                        {this.footerView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLiveScoreDivisionList,
        liveScoreRoundListAction,
        clearRoundData,
        fixtureCompetitionListAction,
        getYearListing,
        getliveScoreTeams,
        getAllOrganisationListAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreFixturCompState: state.LiveScoreFixturCompState,
        liveScoreLadderState: state.LiveScoreLadderState,
        liveScoreCompetition: state.liveScoreCompetition,
        liveScoreRoundState: state.LiveScoreRoundState,
        appState: state.AppState,
        userState: state.UserState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreSeasonFixture));

