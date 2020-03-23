import React from "react";
import { NavLink } from "react-router-dom";
import { Input, Icon, Select } from "antd";
import "./layout.css";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import AppImages from "../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserOrganisationAction, onOrganisationChangeAction } from "../store/actions/userAction/userAction";
import {
  setOrganisationData,
  getOrganisationData
} from "../util/sessionStorage";

const { Option } = Select;

class DashboardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowMobile: false,
      dataOnload: false
    };
  }

  componentDidUpdate(nextProps) {
    if (this.props.userState.onLoad == false && this.state.dataOnload == true) {
      let organisationData = this.props.userState.getUserOrganisation
      if (organisationData.length > 0) {
        let orgData = getOrganisationData()
        let organisationItem = orgData ? orgData : organisationData[0]
        setOrganisationData(organisationItem)
        this.props.onOrganisationChangeAction(organisationItem, "organisationChange")
        this.setState({ dataOnload: false })
      }
    }
  }


  componentDidMount() {
    this.setOrganisationKey()
  }


  setOrganisationKey() {
    let organisationData = getOrganisationData()
    if (!organisationData) {
      this.props.userState.getUserOrganisation.length == 0 && this.props.getUserOrganisationAction()
      this.setState({ dataOnload: true })
    }
    else {
      this.props.userState.getUserOrganisation.length == 0 && this.props.getUserOrganisationAction()
      this.setState({ dataOnload: true })
    }
  }

  logout = async () => {
    await localStorage.clear();
    history.push("/");
  };

  menuImageChange = menuName => {
    switch (menuName) {
      case AppConstants.home:
        return AppImages.homeIcon;

      case AppConstants.user:
        return AppImages.userIcon;

      case AppConstants.registration:
        return AppImages.regIcon;

      case AppConstants.competitions:
        return AppImages.compIcon;

      case AppConstants.liveScores:
        return AppImages.liveScoreIcon;

      case AppConstants.events:
        return AppImages.eventsIcon;

      case AppConstants.shop:
        return AppImages.shopIcon;

      case AppConstants.umpires:
        return AppImages.umpireIcon;

      case AppConstants.incidents:
        return AppImages.incidentIcon;

      case AppConstants.finance:
        return AppImages.financeIcon;

      default:
        return AppImages.homeIcon;
    }
  };

  ////search view input on width<767px
  searchView = () => {
    this.setState({ windowMobile: !this.state.windowMobile });
  };

  onOrganisationChange = (organisationData) => {
    this.props.onOrganisationChangeAction(organisationData, "organisationChange")
    setOrganisationData(organisationData)
    history.push("./")
  }

  ///////user profile dropdown
  userProfileDropdown() {
    let userData = this.props.userState.getUserOrganisation
    let selectedOrgData = getOrganisationData()
    let userImage = selectedOrgData ? (selectedOrgData.photoUrl ? selectedOrgData.photoUrl : AppImages.defaultUser) : AppImages.defaultUser
    return (
      <div className="dropdown">
        <button
          className="dropdown-toggle"
          type="button"
          data-toggle="dropdown"
        >
          <img
            src={userImage}
            alt="" />
        </button>
        <ul className="dropdown-menu">
          <li>
            <div className="media">
              <div className="media-left">
                <figure className="user-img-wrap">
                  <img
                    src={userImage}
                    alt=""
                  />
                </figure>
              </div>
              <div className="media-body">
                {selectedOrgData ?
                  <span className="user-name">
                    {selectedOrgData.firstName + " " + selectedOrgData.lastName}
                  </span>
                  : null}
                <span className="user-name-btm pt-3">
                  {selectedOrgData ?
                    <span style={{ textTransform: "capitalize" }}>
                      {selectedOrgData.name + "(" + selectedOrgData.userRole + ")"}
                    </span>
                    : null}
                </span>
              </div>
            </div>
          </li>
          {userData.length > 0 ?
            <div className="acc-help-support-list-view">
              {userData.map((item, index) => {
                return (
                  <li>
                    <a onClick={() => this.onOrganisationChange(item)}>
                      <span style={{ textTransform: "capitalize" }}>{item.name + "(" + item.userRole + ")"}</span>
                    </a>
                  </li>
                )
              })}
            </div>
            : null}
          <div className="acc-help-support-list-view">
            <li>
              <a href="#">{"Account Settings"}</a>
            </li>
            <li>
              <a href="#"> {"Help & Support"}</a>
            </li>
          </div>
          <li className="log-out">
            <a onClick={() => this.logout()}>{"Log Out"}</a>
          </li>
        </ul>
      </div>
    )
  }



  render() {
    let menuName = this.props.menuName;
    return (
      <header className="site-header">
        <div className="header-wrap">
          <div className="row m-0-res">
            <div className="col-sm-12 d-flex">
              <div className="logo-box">
                <NavLink to="/" className="site-brand">
                  <img src={AppImages.netballLogo1} alt="" />
                </NavLink>
                <div className="col-sm dashboard-layout-menu-heading-view">
                  <span className="dashboard-layout-menu-heading">
                    {this.props.menuHeading}
                  </span>
                </div>
                {/* <div className="col-sm width_200 mt-1">
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 50,
                    }}
                  >
                    <span className="year-select-heading">
                      {AppConstants.organisation}:
            </span>
                    <Select
                      style={{ minWidth: 160, minHeight: "initial" }}
                      name={"competition"}
                      className="year-select org-select"
                      onChange={organisationUniqueKey => this.onOrganisationChange(organisationUniqueKey)}
                      value={JSON.parse(JSON.stringify(this.state.organisationUniqueKey))}
                    >
                      {this.props.userState.venueOragnasation.map(item => {
                        return (
                          <Option key={"organisationUniqueKey" + item.organisationUniqueKey} value={item.organisationUniqueKey}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </div> */}
              </div>
              <div className="user-right">
                <ul className="d-flex">
                  {/* <li>
                    <button
                      className="dashboard-lay-search-button"
                      onClick={() => this.searchView()}
                    >
                      <img
                        src={AppImages.searchIcon}
                        height="15"
                        width="15"
                        alt=""
                      />
                    </button>
                    <form className="search-form">
                      <div className="reg-product-search-inp-width">
                        <Input
                          className="product-reg-search-input"
                          placeholder="Search..."
                          prefix={
                            <Icon
                              type="search"
                              style={{
                                color: "rgba(0,0,0,.25)",
                                height: 16,
                                width: 16
                              }}
                            />
                          }
                        />
                      </div>

                    </form>
                  </li>
                  <li>
                    <div className="site-menu">
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <img src={this.menuImageChange(menuName)} alt="" />
                        </button>
                        <ul className="dropdown-menu">
                          <li
                            className={
                              menuName === AppConstants.home ? "active" : ""
                            }
                          >
                            <div className="home-menu menu-wrap">
                              <NavLink to="/homeDashboard">
                                <span className="icon"></span>
                                {AppConstants.home}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.user ? "active" : ""
                            }
                          >
                            <div className="user-menu menu-wrap">
                              <NavLink to="/userDashboard">
                                <span className="icon"></span>
                                {AppConstants.user}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.registration
                                ? "active"
                                : ""
                            }
                          >
                            <div className="registration-menu menu-wrap">
                              <NavLink to="/registration">
                                <span className="icon"></span>
                                {AppConstants.registration}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.competitions
                                ? "active"
                                : ""
                            }                          >
                            <div className="competitions-menu menu-wrap">
                              <NavLink to="/competitionDashboard">
                                <span className="icon"></span>
                                {AppConstants.competitions}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.liveScores
                                ? "active"
                                : ""
                            }
                          >
                            <div className="lives-cores menu-wrap">
                              <NavLink to="/liveScoreCompetitions">
                                <span className="icon"></span>
                                {AppConstants.liveScores}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.events ? "active" : ""
                            }
                          >
                            <div className="events-menu menu-wrap">
                              <a href="#">
                                <span className="icon"></span>
                                {AppConstants.events}
                              </a>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.shop ? "active" : ""
                            }
                          >
                            <div className="shop-menu menu-wrap">
                              <a href="#">
                                <span className="icon"></span>
                                {AppConstants.shop}
                              </a>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.umpires ? "active" : ""
                            }
                          >
                            <div className="umpires-menu menu-wrap">
                              <NavLink to="/umpireAllocation">
                                <span className="icon"></span>
                                {AppConstants.umpires}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.incidents
                                ? "active"
                                : ""
                            }
                          >
                            <div className="incidents-menu menu-wrap">
                              <a href="#">
                                <span className="icon"></span>
                                {AppConstants.incidents}
                              </a>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.finance ? "active" : ""
                            }
                          >
                            <div className="finance-menu menu-wrap">
                              <a href="#">
                                <span className="icon"></span>
                                {AppConstants.finance}
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li> */}
                  <li>
                    <div className="user-profile-box">
                      {this.userProfileDropdown()}
                    </div>
                  </li>
                </ul>
                {this.state.windowMobile && (
                  <div className="dash-search-inp-width">
                    <Input
                      className="product-reg-search-input"
                      placeholder="Search..."
                      prefix={
                        <Icon
                          type="search"
                          style={{
                            color: "rgba(0,0,0,.25)",
                            height: 16,
                            width: 16
                          }}
                        />
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUserOrganisationAction,
    onOrganisationChangeAction
  }, dispatch)
}

function mapStatetoProps(state) {
  return {
    userState: state.UserState
  }
}
export default connect(mapStatetoProps, mapDispatchToProps)((DashboardLayout));
