import React, { Component } from "react";
import { Layout, Breadcrumb, Pagination, Table, Select } from 'antd';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreLaddersListAction, clearLadderList } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
import history from "../../util/history";
// import {getLiveScoreCompetiton,setAuthToken, setUserId, setOrganistaionId, setCompetitionID, getAuthToken, getUserId  } from '../../util/sessionStorage'
import { getliveScoreOrgID, setAuthToken, setUserId, setliveScoreOrgID, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'

import { fixtureCompetitionListAction } from "../../store/actions/LiveScoreAction/LiveScoreFixtureAction"

const { Content } = Layout;
const { Option } = Select;
const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c95d69a0e179191e4422d8df456c7dc7268069d560e9e677eb64ca0d506751ea12c34b087a73bc319ba9b17a67ffc69fde351109f091cb2e64e6a60042bcbb11bf6d73e2be792c9658cc5604e115967a82eb0f2f944a1e2950e0116df2065b0ba2fb5dcf34f9341f6b7b6f2e64839339d24123ea015526f05fe22cec9cf96aa86ff990588beafbc3675f550605d72d25247';
const userId = 0
/////function to sort table column
function tableSort(a, b, key) {
    //if (a[key] && b[key]) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
    //}

}


////Table columns
const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        sorter: (a, b) => tableSort(a, b, "rank"),
    },
    {
        title: 'Team',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
        render: (data, record) => (
            record.hasAdjustments ? 
            <span className="required-field">{data}</span>
            :  <span>{data}</span>
        )

    },

    {
        title: 'P',
        dataIndex: 'P',
        key: 'P',
        sorter: (a, b) => tableSort(a, b, "P"),

    },
    {
        title: 'W',
        dataIndex: 'W',
        key: 'W',
        sorter: (a, b) => tableSort(a, b, "W"),


    },
    {
        title: 'L',
        dataIndex: 'L',
        key: 'L',
        sorter: (a, b) => tableSort(a, b, "L"),
    },
    {
        title: 'D',
        dataIndex: 'D',
        key: 'D',
        sorter: (a, b) => tableSort(a, b, "D"),


    },
    {
        title: 'FW',
        dataIndex: 'FW',
        key: 'FW',
        sorter: (a, b) => tableSort(a, b, "FW"),

    },
    {
        title: 'FL',
        dataIndex: 'FL',
        key: 'FL',
        sorter: (a, b) => tableSort(a, b, "FL"),

    },
    {
        title: 'F',
        dataIndex: 'F',
        key: 'F',
        sorter: (a, b) => tableSort(a, b, "F"),
    },
    {
        title: 'A',
        dataIndex: 'A',
        key: 'A',
        sorter: (a, b) => tableSort(a, b, "A"),


    },
    {
        title: 'PTS',
        dataIndex: 'PTS',
        key: 'PTS',
        sorter: (a, b) => tableSort(a, b, "PTS"),
    },
    {
        title: '%',
        dataIndex: 'SMR',
        key: 'SMR',
        sorter: (a, b) => tableSort(a, b, "SMR"),
        render: (SMR) => <span>{(JSON.parse(SMR) * 100).toFixed(2) + "%"}</span>
    },
];


class LiveScorePublicLadder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            division: "",
            loadding: false,
            competitionId: null,
            competitionUniqueKey: null,
            gameTimeTracking: false,
            onCompLoad: false,
            onDivisionLoad: false,
            selectedComp: null
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.competitionladders}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    async componentDidMount() {
        setUserId(userId);
        setAuthToken(token);
        // let orgParam =  this.props.location.search.split("?organisationId=")
        let orgParam = this.props.location.search.split("?organisationKey=")
        let orgId = orgParam[1]

        setliveScoreOrgID(orgId)
        let organisationId = await getliveScoreOrgID()

        if (organisationId != undefined) {
            this.setState({ onCompLoad: true })
            this.props.fixtureCompetitionListAction(organisationId)
        } else {

            history.push('/liveScorePublicLadder')
        }

        // this.props.fixtureCompetitionListAction(orgId)
    }

    async getCompDetails() {
        let compDetails = await getLiveScoreCompetiton()
        return compDetails
    }


    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreFixturCompState !== this.props.liveScoreFixturCompState) {
            if (this.state.onCompLoad == true && this.props.liveScoreFixturCompState.onLoad == false) {
                if (this.props.liveScoreFixturCompState.comptitionList.length > 0) {
                    let firstComp = this.props.liveScoreFixturCompState.comptitionList && this.props.liveScoreFixturCompState.comptitionList[0].id
                    let compKey = this.props.liveScoreFixturCompState.comptitionList && this.props.liveScoreFixturCompState.comptitionList[0].competitionUniqueKey
                    this.props.getLiveScoreDivisionList(firstComp)
                    this.setState({ selectedComp: firstComp, onCompLoad: false, onDivisionLoad: true, competitionUniqueKey: compKey })
                }

            }
        }

        if (this.props.liveScoreLadderState !== nextProps.liveScoreLadderState) {
            if (this.props.liveScoreLadderState.onLoad == false && this.state.onDivisionLoad == true) {

                if (this.props.liveScoreLadderState.liveScoreLadderDivisionData.length > 0) {
                    let division = this.props.liveScoreLadderState.liveScoreLadderDivisionData[0].id
                    this.setState({ onDivisionLoad: false, division })
                    this.props.liveScoreLaddersListAction(this.state.selectedComp, division, this.state.competitionUniqueKey)
                }
            }
        }
    }

    onChangeComp(compID) {
        let selectedComp = compID.comp
        let compKey = compID.competitionUniqueKey
        this.props.clearLadderList()
        this.props.getLiveScoreDivisionList(selectedComp)
        this.setState({ selectedComp, onDivisionLoad: true, division: null, competitionUniqueKey: compKey })

    }


    changeDivision(divisionId) {
        this.props.clearLadderList()
        let division = divisionId.division
        this.props.liveScoreLaddersListAction(this.state.competitionId, division, this.state.competitionUniqueKey)
        this.setState({ division })
    }

    divisionChange = (value) => {

    }


    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { liveScoreLadderState } = this.props;
        let competition = this.props.liveScoreFixturCompState.comptitionList ? this.props.liveScoreFixturCompState.comptitionList : []
        let division = isArrayNotEmpty(liveScoreLadderState.liveScoreLadderDivisionData) ? liveScoreLadderState.liveScoreLadderDivisionData : []
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row" >
                    <div className="col-sm mt-2" style={{ width: "fit-content" }} >
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
                    <div className="col-sm mt-2" style={{ width: "fit-content" }}>
                        <span className='year-select-heading'>{AppConstants.division}:</span>
                        <Select
                            className="year-select reg-filter-select-competition ml-2"
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
            </div>
        )
    }



    ////////form content view
    contentView = () => {
        const { liveScoreLadderState } = this.props;

        let DATA = liveScoreLadderState.liveScoreLadderListData
        let adjData = liveScoreLadderState.liveScoreLadderAdjData;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreLadderState.onLoad == true ? true : false} className="home-dashboard-table" columns={columns} dataSource={DATA} pagination={false}
                    />
                </div>

                <div  className="comp-dash-table-view mt-4 ml-1">
                    <div className="ladder-list-adjustment">
                        {
                            (adjData || []).map((x,index) =>(
                                <div key ={index} style={{marginBottom: '10px'}}>
                                    <li className="required-field">{x.teamName + ' deducted ' + x.points + ' points for ' + x.adjustmentReason   }</li>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }

    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    isManuNotVisible={true}
                // menuName={AppConstants.liveScores}
                />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>

        );
    }
}
function mapDispatchtoprops(dispatch) {
    return bindActionCreators({ clearLadderList, liveScoreLaddersListAction, getLiveScoreDivisionList, fixtureCompetitionListAction }, dispatch)

}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState,
        liveScoreFixturCompState: state.LiveScoreFixturCompState,
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScorePublicLadder));
