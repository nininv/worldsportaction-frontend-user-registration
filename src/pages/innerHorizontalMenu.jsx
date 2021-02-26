import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import "./layout.css";
import AppConstants from "../themes/appConstants";

const { SubMenu } = Menu;
class InnerHorizontalMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                {this.props.menu === "competition" && (
                    <Menu
                        // className="nav-collapse collapse"
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        style={{ lineHeight: "64px" }}
                        selectedKeys={[this.props.compSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <NavLink to="/competitionDashboard">
                                Dashboard
                            </NavLink>
                        </Menu.Item>

                        <SubMenu
                            key="sub1"
                            title={<span>Own Competitions</span>}
                        >
                            <Menu.Item key="2">
                                {/* <a href="https://comp-management-test.firebaseapp.com/quick-competitions.html">Quick Competition</a> */}
                                <NavLink to="competitionQuickCompetition">
                                    <span>Quick Competition</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <NavLink to="/competitionOpenRegForm">
                                    <span> Competition Details</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <NavLink to="/competitionPlayerGrades">
                                    <span>Player Grading</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <NavLink to="/competitionPartTeamGradeCalculate">
                                    <span>Team Grading</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <NavLink to="/competitionCourtAndTimesAssign">
                                    <span>Time Slots</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="7">
                                <NavLink to="/competitionVenueTimesPrioritisation">
                                    <span>Venues</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="8">
                                <NavLink to="/competitionLadder">
                                    <span>Ladder</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="9">
                                <NavLink to="/competitionFormat">
                                    <span>Competition Format</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="10">
                                <NavLink to="/competitionFinals">
                                    <span>Finals</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="11">
                                {/* <a href="http://clixlogix.org/test/netball/fixtures.html">Fixtures</a> */}
                                <NavLink to="competitionFixtures">
                                    Fixtures
                                </NavLink>
                            </Menu.Item>

                            <SubMenu key="sub2" title={<span>Draw</span>}>
                                <Menu.Item key="12">
                                    <NavLink to="/competitionMatchSheets">
                                        <span>Match Sheets</span>
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key="13">
                                    <NavLink to="/competitionReGrading">
                                        <span>Re-grading</span>
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key="18">
                                    {/* <a href="https://comp-management-test.firebaseapp.com/competitions-draws.html">Draws</a> */}
                                    <NavLink to="/competitionDraws">
                                        <span>Draws</span>
                                    </NavLink>
                                </Menu.Item>
                            </SubMenu>
                        </SubMenu>

                        <SubMenu
                            key="sub3"
                            title={<span>Participating-In Competitions</span>}
                        >
                            <Menu.Item key="14">
                                <NavLink to="/competitionPartPlayerGrades">
                                    <span>Player Grading</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="15">
                                <NavLink to="/competitionPartProposedTeamGrading">
                                    <span>Team Grading</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="16">Fixtures</Menu.Item>
                            <Menu.Item key="17">Draw</Menu.Item>
                        </SubMenu>
                    </Menu>
                )}
                {this.props.menu === "registration" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        style={{ lineHeight: "64px" }}
                        selectedKeys={[this.props.regSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <NavLink to="/registration">
                                <span>Dashboard</span>
                            </NavLink>
                        </Menu.Item>

                        <SubMenu key="sub1" title={<span>Fees</span>}>
                            <Menu.Item key="6">
                                <NavLink to="/registrationMembershipList">
                                    <span>Membership Fees</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="7">
                                <NavLink to="/registrationCompetitionList">
                                    <span>Competition Fees</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>

                        <Menu.Item key="3">
                            <NavLink to="/registrationForm">
                                <span>Registration Form</span>
                            </NavLink>
                        </Menu.Item>

                        <Menu.Item key="4">
                            <NavLink to="/registrationPayments">
                                <span>Payments</span>
                            </NavLink>
                            {/* <a href="https://comp-management-test.firebaseapp.com/payment-dashboard.html">Payments</a> */}
                        </Menu.Item>

                        <Menu.Item key="5">De-registration forms</Menu.Item>
                    </Menu>
                )}

                {this.props.menu === "liveScore" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        style={{ lineHeight: "64px" }}
                        selectedKeys={[this.props.liveScoreSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <NavLink to="/liveScoreDashboard">
                                <span>Dashboard</span>
                            </NavLink>
                        </Menu.Item>

                        <SubMenu
                            key="sub1"
                            title={<span>Competition Details</span>}
                        >
                            <Menu.Item key="2">
                                <NavLink to="/liveScoreMatches">
                                    <span>Matches</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <NavLink to="/liveScoreTeam">
                                    <span>Teams</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <NavLink to="/liveScoreManagerList">
                                    <span>Managers</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <NavLink to="/liveScorerList">
                                    <span>Scorers</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <NavLink to="/liveScoreUmpaireList">
                                    <span>Umpires</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="7">
                                <NavLink to="/liveScorePlayerList">
                                    <span>Players</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="8">
                                {/* <NavLink to=""> */}
                                <span>Clubs</span>
                                {/* </NavLink> */}
                            </Menu.Item>
                            <Menu.Item key="9">
                                <NavLink to="/liveScoreDivisionList">
                                    <span>Divisions</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="10">
                                {/* <NavLink to=""> */}
                                <span>Venues</span>
                                {/* </NavLink> */}
                            </Menu.Item>

                            <Menu.Item key="11">
                                <NavLink to="/liveScoreLadderList">
                                    <span>Ladder</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>

                        <SubMenu key="sub2" title={<span>Match Day</span>}>
                            <Menu.Item key="12">
                                <NavLink to="/liveScoreBulkChange">
                                    <span>Bulk Match Change</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="13">
                                {/* <NavLink to=""> */}
                                <span>Court Change</span>
                                {/* </NavLink> */}
                            </Menu.Item>
                            <Menu.Item key="14">
                                <NavLink to="/liveScoreTeamAttendance">
                                    <span>Team Attendance</span>
                                </NavLink>
                            </Menu.Item>

                            <SubMenu key="sub3" title={<span>Statistics</span>}>
                                <Menu.Item key="15">
                                    <NavLink to="/liveScoreGameTimeList">
                                        <span>Game Time</span>
                                    </NavLink>
                                </Menu.Item>
                                {/* <Menu.Item key="16"> */}
                                {/* <NavLink to="/liveScoreShooting"> */}
                                {/* <span>Shooting</span> */}
                                {/* </NavLink> */}
                                {/* </Menu.Item> */}
                                <Menu.Item key="16">
                                    <NavLink to="/liveScoreGoalsList">
                                        <span>Goals</span>
                                    </NavLink>
                                </Menu.Item>
                            </SubMenu>

                            <Menu.Item key="17">
                                <NavLink to="/liveScoreIncidentList">
                                    <span>Incidents</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span>Settings</span>}>
                            <Menu.Item key="18">
                                <NavLink to="/liveScoreSettingsView">
                                    <span>Settings</span>
                                </NavLink>
                            </Menu.Item>
                            {/* <Menu.Item key="18">
                            <NavLink to="/liveScoreLadderList">
                                <span>Ladder</span>
                            </NavLink>
                        </Menu.Item> */}
                            <Menu.Item key="19">
                                <NavLink to="/liveScoreBanners">
                                    <span>Banners</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="20">
                            <NavLink to="/liveScoreNewsList">
                                <span>News & Messages</span>
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                )}

                {this.props.menu === "umpire" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        style={{ lineHeight: "64px" }}
                        selectedKeys={[this.props.umpireSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <span>Dashboard</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <NavLink to="/umpireAllocation">
                                <span>Umpire Allocation</span>
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                )}

                {this.props.menu === "user" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        style={{ lineHeight: "64px" }}
                        selectedKeys={[this.props.userSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <NavLink to="/userDashboard">
                                <span>{AppConstants.dashboard}</span>
                            </NavLink>
                            {/* <a href="https://comp-management-test.firebaseapp.com/user-dashboard.html">
                            <span >Dashboard</span>
                        </a> */}
                        </Menu.Item>
                        <SubMenu
                            key="sub2"
                            title={<span>{AppConstants.maintain}</span>}
                        >
                            <Menu.Item key="4">
                                <NavLink to="/venuesList">
                                    <span>{AppConstants.venueAndCourts}</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub1"
                            title={<span>{AppConstants.administrators}</span>}
                        >
                            <Menu.Item key="2">
                                <NavLink to="/userAffiliatesList">
                                    <span>{AppConstants.affiliates}</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <NavLink to="/userOurOrganisation">
                                    <span>{AppConstants.ourOrganisation}</span>
                                </NavLink>
                            </Menu.Item>
                            {/* <Menu.Item key="3">
                            <NavLink to="/userAffiliateApproveRejectForm" >
                                <span >{AppConstants.affiliateApproveReject}</span>
                            </NavLink>
                        </Menu.Item> */}
                        </SubMenu>
                    </Menu>
                )}
            </div>
        );
    }
}

export default InnerHorizontalMenu;
