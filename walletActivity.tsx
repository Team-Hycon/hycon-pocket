import { notification } from "onsenui"
import * as React from "react"
import { Button, List, ListHeader, ListItem, Page, Toolbar, Icon, Row, Col, Input, Range, Select, Checkbox } from "react-onsenui"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"

var Ons = require('react-onsenui')
const transactionList = [
    {
        status: "pending",
        timestamp: "2018/02/05 22:14:56",
        from: "Hbfb2aab1bc02cbc1ab911572a559314",
        to: "Hbfb2btbc02c58bc1ab911572a55935h",
        amount: "100",
        fee: "0.00025",
        hash: "020e11ba07c56c469af5e7be2920bf"
    },
    {
        status: "completed",
        timestamp: "2018/03/07 13:06:01",
        from: "H2r72a572a5c02cbc1ab91193145ab1b",
        to: "H8bb2btbc02c1bf911572a55935h5abc",
        amount: "100",
        fee: "0.00025",
        hash: "020e11ba07c56c469af5e7be2920bf"
    },
    {
        status: "completed",
        timestamp: "2018/12/08 06:14:13",
        from: "Hbc1ab9115722aab1bc02c59314a5bfb",
        to: "H8bc1a59bfb2btbc02c535hb911572a5",
        amount: "34",
        fee: "0.0019",
        hash: "a07c9a020e11920bfbf56c465e7be2"
    },
    {
        status: "completed",
        timestamp: "2018/03/14 11:57:56",
        from: "H72a5593bfb2aab1bab911514c02cbc1",
        to: "Hab911bfb2b1572a55935htbc02c58bc",
        amount: "10",
        fee: "0.00000001",
        hash: "56c46020e11b9af5e7be2920bfa07c"
    },
    {
        status: "completed",
        timestamp: "2018/10/08 08:13:34",
        from: "H02cbc1ab91bfb2aab1bc1572a559a5e",
        to: "H8bc1ab911bfb2btbc02c5572a559fg7",
        amount: "580",
        fee: "0.0000045",
        hash: "0e7be2920bf20e11ba07c56c469af5"
    },
    {
        status: "completed",
        timestamp: "2018/02/05 09:23:57",
        from: "Hc1ab9115bf   b2aab1bc02cb72a559323",
        to: "Htbc02c58bc1ab91157bfb2b2a55dy8h",
        amount: "45",
        fee: "0.00005",
        hash: "f25w1ba07c56c469af5e7be2927i1"
    }
]


const minerFeeList = [
    {
        timestamp: "2018/02/05 22:14:56",
        miner: "Hbfb2aab1bc02cbc1ab911572a559314",
        fee: "0.00025",
        block: "020e11ba07c56c469af5e7be2920bf"
    },
    {
        timestamp: "2018/03/07 13:06:01",
        miner: "H2r72a572a5c02cbc1ab91193145ab1b",
        fee: "0.00025",
        block: "020e11ba07c56c469af5e7be2920bf"
    },
    {
        timestamp: "2018/11/10 16:04:03",
        miner: "Hcbc1abc02bf1b911572a559314b2aab",
        fee: "0.00025",
        block: "7c56c469a0e7b920bfe2af5020e11b"
    },
    {
        timestamp: "2018/06/09 23:48:53",
        miner: "H2r72a572a5c02cbc1ab91193145ab1b",
        fee: "0.0000001",
        block: "0a07c5611b9af5e7be2920bc4620eg"
    }
]


interface IProps {
    rest: IRest
    language: IText
}
// tslint:disable-next-line:no-empty-interface
interface IState {

}
export class WalletActivity extends React.Component<IProps, any> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
        })
    }

    constructor(props: IProps) {
        super(props)
        this.state = {
            modifier: "en",
            transactionSelected: true,
            isDialogShown: false,
            isMinerShown: false,
            isHashShown: false,
            dialogVal: ""
        }
        // props.rest.getWalletList().then((w) => this.setWallets(w.walletList))
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public renderToolbar() {
        return (
            <Toolbar>
                <Link to="/" className="left"> Back</Link>
                <div className="center">Activity</div>
                <Link to="/sendcoins" className="right">Send Hycons</Link>
            </Toolbar>
        )
    }

    public renderTransactionRow(row: any, index: any) {
        return (
            <Ons.ListItem key={"transaction" + index} >
                <Row>
                    <Col verticalAlign="center">
                        <h1>{transactionList[index].status}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <p>{transactionList[index].timestamp}</p>
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <p onClick={this.openDialog.bind(this)} id={transactionList[index].from + "/" + transactionList[index].to}>{transactionList[index].from.substr(0, 5)}... to {transactionList[index].to.substr(0, 5)}...</p>
                        {this.state.isDialogShown ? this.showUsersDialog() : <p> </p>}
                    </Col>
                    <Col verticalAlign="center">
                        <p>{transactionList[index].amount} HYC</p>
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <p onClick={this.openHashDialog.bind(this)} id={transactionList[index].hash} >{transactionList[index].hash.substr(0, 5)}...</p>
                        {this.state.isHashShown ? this.showHashDialog() : <p> </p>}
                    </Col>
                    <Col verticalAlign="center">
                        <p>{transactionList[index].fee} HYC</p>
                    </Col>
                </Row>
            </Ons.ListItem>
        );
    }

    public renderFeeRow(row: any, index: any) {
        return (
            <Ons.ListItem key={"fee" + index} >
                <Row>
                    <Col verticalAlign="center">
                        {minerFeeList[index].timestamp}
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <p onClick={this.openMinerDialog.bind(this)} id={minerFeeList[index].miner}>{minerFeeList[index].miner.substr(0, 5)}...</p>
                        {this.state.isMinerShown ? this.showMinerDialog() : <p> </p>}
                    </Col>
                    <Col verticalAlign="center">
                        <p>{minerFeeList[index].fee} HYC</p>
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <p>{minerFeeList[index].block}</p>
                    </Col>
                </Row>
            </Ons.ListItem>
        );
    }

    public renderContent() {
        return (
            <section>
                <div>
                    <Button modifier="large--cta" onClick={this.makeTransactionsList.bind(this)}>
                        Transactions
                        </Button>
                    <Button modifier="large--cta" onClick={this.makeFeesList.bind(this)}>
                        Fees
                        </Button>
                </div>
                {
                    this.state.transactionSelected ?
                        <Ons.List
                            id="transitionList"
                            dataSource={transactionList}
                            renderRow={this.renderTransactionRow.bind(this)}
                            renderHeader={() => <Ons.ListHeader>Transactions</Ons.ListHeader>}
                        />
                        :
                        <Ons.List
                            id="feeList"
                            dataSource={minerFeeList}
                            renderRow={this.renderFeeRow.bind(this)}
                            renderHeader={() => <Ons.ListHeader>Miner Fees</Ons.ListHeader>}
                        />
                }

            </section>
        )

    }
    public render() {
        return (
            <div>
                <Page renderToolbar={() => this.renderToolbar()}>
                    {this.renderContent()}
                </Page>
            </div>
        )
    }

    private makeTransactionsList(e: any) {
        this.setState({
            transactionSelected: true
        })
    }

    private makeFeesList(e: any) {
        this.setState({
            transactionSelected: false
        })
    }

    private openDialog(e: any) {
        this.setState({
            isDialogShown: true,
            dialogVal: e.target.id
        })
    }

    private openMinerDialog(e: any) {
        this.setState({
            isMinerShown: true,
            dialogVal: e.target.id
        })
    }

    private openHashDialog(e: any) {
        this.setState({
            isHashShown: true,
            dialogVal: e.target.id
        })
    }

    private hideDialog() {
        this.setState({
            isDialogShown: false,
            isMinerShown: false,
            isHashShown: false,
            dialogVal: ""
        })
    }

    private showUsersDialog() {
        var from: String = this.state.dialogVal.split("/")[0]
        var to: String = this.state.dialogVal.split("/")[1]
        return (
            <Ons.Dialog
                isOpen={this.state.isDialogShown}
                isCancelable={false}>
                <div className='alert-dialog-title'>From - To</div>
                <div className='alert-dialog-content'>{from}<br />to<br />{to}</div>
                <div className='alert-dialog-footer'>
                    <button onClick={this.hideDialog.bind(this)} className='alert-dialog-button'>Close</button>
                </div>
            </Ons.Dialog>)

    }

    private showMinerDialog() {
        var miner: String = this.state.dialogVal
        return (
            <Ons.Dialog
                isOpen={this.state.isMinerShown}
                isCancelable={false}>
                <div className='alert-dialog-title'>Miner Address</div>
                <div className='alert-dialog-content'>{miner}</div>
                <div className='alert-dialog-footer'>
                    <button onClick={this.hideDialog.bind(this)} className='alert-dialog-button'>Close</button>
                </div>
            </Ons.Dialog>)

    }

    private showHashDialog() {
        var h: String = this.state.dialogVal
        return (
            <Ons.Dialog
                isOpen={this.state.isHashShown}
                isCancelable={false}>
                <div className='alert-dialog-title'>Hash</div>
                <div className='alert-dialog-content'>{h}</div>
                <div className='alert-dialog-footer'>
                    <button onClick={this.hideDialog.bind(this)} className='alert-dialog-button'>Close</button>
                </div>
            </Ons.Dialog>)

    }

}
