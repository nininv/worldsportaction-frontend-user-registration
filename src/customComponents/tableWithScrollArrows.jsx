import React, { Component } from "react";
import { Table, Icon } from 'antd';

let this_Obj = null;

let isScrollActive = false;
let additionalTableScrollX = 0;
let tableScrollX = 0;
let prevTimeTableScroll = 0;
let prevScrollTable = 0;

const initialOverflowTableData = {
    isOverflow: false,
    overflowDiff: null,
}

class TableWithScrollArrows extends Component {
    constructor(props) {
        super(props);
        this_Obj = this;
        this.state = {
            overflowTableData: initialOverflowTableData,
            isMounted: false,
        }

        this.tableScrollDirectionRef = React.createRef(0);
        this.tableRef = React.createRef();
        this.leftArrowRef = React.createRef();
        this.rightArrowRef = React.createRef();
    }

    componentDidMount() {
        this.setState({ isMounted: true });

        this.tableRef.current.addEventListener('scroll', this.changeArrowVisibility);

        window.addEventListener('resize', this.addResizeOverflow);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.addResizeOverflow);
        this.tableRef.current.removeEventListener('scroll', this.changeArrowVisibility);
    }

    addResizeOverflow = () => {
        const { overflowTableData } = this.state;
        const { isOverflow } = overflowTableData;

        const overflowData = this.checkOverflowRef();
        const elOverflow = overflowData.isOverflow;

        if (isOverflow) {
            this.setState({
                overflowTableData: {
                    isOverflow: true,
                    overflowDiff: overflowData.overflowDiff,
                }
            }, this.changeArrowVisibility);
        }

        else if (!isOverflow && elOverflow) {
            this.setState({
                overflowTableData: {
                    ...overflowTableData,
                    isOverflow: true,
                }
            });
        }

        else if (isOverflow && !elOverflow) {
            this.setState({
                overflowTableData: initialOverflowTableData
            }, this.changeArrowVisibility);
        }
    };

    componentDidUpdate() {
        // hack to define tables overflow to display scroll arrows
        
        this.changeOverflowState();
    }

    checkOverflowRef = () => this.tableRef.current && this.checkOverflow();

    changeOverflowState = () => {
        const prevOverflowData = this.state.overflowTableData;

        const overflowData = this.checkOverflowRef();
        const { isOverflow = false, overflowDiff = null } = overflowData;

        if (!prevOverflowData.isOverflow && isOverflow) {
            this.setState({ 
                overflowTableData: {
                    isOverflow,
                    overflowDiff,
                }
            });
        }
    }

    checkOverflow = () => {
        const el = this.tableRef.current;
        const curOverflow = el.style.overflow;

        if (!curOverflow || curOverflow === "visible")
        el.style.overflow = "hidden";

        const isOverflow = el.clientWidth < el.scrollWidth;
        const overflowDiff = el.scrollWidth - el.clientWidth;

        el.style.overflow = curOverflow;

        const overflowData = {
            isOverflow,
            overflowDiff,
        }

        return overflowData;
    }

    changeArrowVisibility = () => {
        const scroller = this.tableRef.current;
        const leftArrow = this.leftArrowRef.current;
        const rightArrow = this.rightArrowRef.current;

        const scrollDiffLeft = scroller && scroller.scrollLeft;
        const { overflowDiff } = this.state.overflowTableData;
        
        if (scrollDiffLeft && scrollDiffLeft !== overflowDiff && !!leftArrow && !!rightArrow) {
            leftArrow.style.display = 'flex';
            rightArrow.style.display = 'flex';
        }

        if (scrollDiffLeft === overflowDiff && !!rightArrow) {
            rightArrow.style.display = 'none';
        }

        if (!scrollDiffLeft && overflowDiff && !!leftArrow && !!rightArrow) {
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'flex';
        }

        if (!overflowDiff) {
            rightArrow.style.display = 'none';
            leftArrow.style.display = 'none';
        }
    }

    doTableScroll = time => {
        const scroller = this.tableRef.current;

        const leftArrow = this.leftArrowRef.current;
        const rightArrow = this.rightArrowRef.current;
        
        this.changeArrowVisibility(scroller, leftArrow, rightArrow);

        const max = 10;
        const f = 0.2;

        let diffTime = time - prevTimeTableScroll;

        if (!isScrollActive) {
            diffTime = 80;
            isScrollActive = true;
        }
        prevTimeTableScroll = time;
      
        additionalTableScrollX = (this.tableScrollDirectionRef.current * max * f + additionalTableScrollX * (1 - f)) * (diffTime / 20);
        
        tableScrollX += additionalTableScrollX;

        const thisScroll = scroller.scrollLeft;
        const nextScroll = Math.floor(thisScroll + additionalTableScrollX);
      
        if (Math.abs(additionalTableScrollX) > 0.5 && nextScroll !== prevScrollTable 
            && (
                (rightArrow.style.display === 'flex' &&  this.tableScrollDirectionRef.current === 1)
                ||
                (leftArrow.style.display === 'flex' &&  this.tableScrollDirectionRef.current === -1)
            )
         ) {
            scroller.scrollLeft = nextScroll;
            requestAnimationFrame(this.doTableScroll);
        } else {
            additionalTableScrollX = 0;
            isScrollActive = false;
        }
        prevScrollTable = nextScroll;
    }


    tableArrowsView = () => {
        const { isOverflow } = this.state.overflowTableData;

        return (
            <>
                {isOverflow && 
                    <>
                        <div
                            ref={this.leftArrowRef}
                            className="justify-content-center align-items-center position-absolute"
                            style={{
                                display: 'none',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: 25,
                                boxShadow: 'inset 10px 0 8px 2px rgba(0,0,0,.15)',
                                cursor: 'w-resize',
                                zIndex: 2,
                            }}
                            onMouseDown={() => {
                                this.tableScrollDirectionRef.current = -1;
                                if (!isScrollActive) {
                                    requestAnimationFrame(this.doTableScroll);
                                }
                            }}
                            onMouseUp={() => {
                                this.tableScrollDirectionRef.current = 0;
                            }}
                        >
                            <Icon
                                type="left"
                                style={{
                                    color: 'var(--app-orange)',
                                    fontSize: 15
                                }}
                            />
                        </div>

                        <div
                            ref={this.rightArrowRef}
                            className="justify-content-center align-items-center position-absolute"
                            style={{
                                display: 'flex',
                                top: 0,
                                right: 0,
                                height: '100%',
                                width: 25,
                                boxShadow: 'inset -10px 0 8px 2px rgba(0,0,0,.15)',
                                cursor: 'e-resize',
                                zIndex: 2,
                            }}
                            onMouseDown={() => {
                                this.tableScrollDirectionRef.current = 1;
                                if (!isScrollActive) {
                                    requestAnimationFrame(this.doTableScroll);
                                }
                            }}
                            onMouseUp={() => {
                                this.tableScrollDirectionRef.current = 0;
                            }}
                        >
                            <Icon 
                                type="right"
                                style={{
                                    color: 'var(--app-orange)',
                                    fontSize: 15
                                }}
                            />
                        </div>
                    </>
                }
            </>
        )
    }

    render() {
        const { columns, showHeader = true, dataSource, pagination, className="" } = this.props;

        return (
            <div className="position-relative">
                <div
                    className="table-responsive home-dash-table-view"
                    ref={this.tableRef}
                    style={{ width: '100%' }}
                > 
                    <Table className="home-dashboard-table"
                        columns={columns}
                        showHeader={showHeader}
                        dataSource={dataSource}
                        pagination={pagination}
                        className={className}
                    />
                </div>
                {this.tableArrowsView()}
            </div>
        );
    }
}

export default TableWithScrollArrows;