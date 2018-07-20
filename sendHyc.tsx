import { notification } from "onsenui"
import * as React from "react"
import { Button, List, ListHeader, ListItem, Page, Toolbar, Icon, Row, Col, Input, Range, AlertDialog } from "react-onsenui"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"

var Ons = require('react-onsenui')
var Long = require('long')
const pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/

const contacts = [{ name: "Alice", addr: "H123fj43333ffgewf" }, { name: "Marine", addr: "H123fj43kl23j08hf" }, { name: "Luca", addr: "H90lfgd5r67koaq0" }]

interface IProps {
    rest: IRest
    language: IText
}
// tslint:disable-next-line:no-empty-interface

export class SendHyc extends React.Component<IProps, any> {

    public static getDerivedStateFromProps(nextProps: IProps, previousState: any): any & IProps {
        return Object.assign(nextProps, {})
    }

    constructor(props: IProps) {
        super(props)
        // props.rest.getWalletList().then((w) => this.setWallets(w.walletList))
        this.state = {
            alertDialogShown: false,
            rangeValue: 0,
            totalMoney: 10,
            amountSending: 0,
            fee: 0,
            address: "",
            fromAddress: "",
            contactsShown: false
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: any): boolean {
        return true
    }

    public renderToolbar() {
        return (
            <Toolbar>
                <Link to="/"><div className="left">Back</div></Link>
                <div className="center">Send Hycon</div>
                <div className="right"></div>
            </Toolbar>
        )
    }

    public renderWallet(wallet: { name: string, address: string }) {
        return (
            <Toolbar modifier="transparent noshadow">
                <Link to="/"><div className="left">Back</div></Link>
                <div className="center">Send Hyc</div>
                <div className="right"></div>
            </Toolbar>
        )
    }

    public render() {
        return (
            <div>
                <Page renderToolbar={() => this.renderToolbar()}>
                    <Row>
                        <Col verticalAlign="center">
                            <Ons.Button onClick={this.handleContacts.bind(this)}>Contacts</Ons.Button>
                            <Ons.Input type="text" value={this.state.address} placeholder='Address' />
                            <Ons.Dialog
                                isOpen={this.state.contactsShown}
                                isCancelable={false}>
                                <div className='alert-dialog-title'>Select one of your contacts</div>
                                {/* <div className='alert-dialog-content'>Select one of your contacts</div> */}
                                <Ons.List
                                    dataSource={contacts}
                                    renderRow={this.renderRow.bind(this)}
                                    renderHeader={() => <Ons.ListHeader>Contacts</Ons.ListHeader>}
                                />
                                <div className='alert-dialog-footer'>
                                    <button onClick={this.handleContactsClose.bind(this)} className='alert-dialog-button'>Cancel</button>
                                    <button onClick={this.handleContactsClose.bind(this)} className='alert-dialog-button'>Ok</button>
                                </div>
                            </Ons.Dialog>
                        </Col>
                    </Row>
                    <section>
                        <p>AMOUNT</p>
                        <Row>
                            <Col verticalAlign="center">
                                <Ons.Button onClick={this.handleMaxClick.bind(this)}>Max</Ons.Button>
                                <Ons.Input type="text" placeholder='amount' value={this.state.amountSending} onChange={this.handleChangeAmount.bind(this)} /> <text>HYC</text>
                            </Col>
                        </Row>
                    </section>
                    <section>
                        <p>FEE</p>
                        <Row>
                            <Col verticalAlign="center">
                                <Ons.Input type="text" placeholder='fee' value={this.state.fee} onChange={this.handleChange.bind(this)} /> <text>HYC</text>
                            </Col>
                        </Row>
                        <Row>
                            <Col verticalAlign="center">
                                <span>0 </span>
                                <Ons.Range
                                    min={0} Max={this.state.totalMoney - this.state.amountSending}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.fee}
                                />
                                <span> {this.state.totalMoney - this.state.amountSending}</span>
                            </Col>
                        </Row>
                    </section>
                    <section>
                        <Row>
                            <Col verticalAlign="center">
                                <Ons.Input type="password" placeholder='Password' />
                                <Ons.Button onClick={this.onClickHint.bind(this)} >Hint</Ons.Button>
                            </Col>
                            <Ons.AlertDialog
                                isOpen={this.state.alertDialogShown}
                                isCancelable={false}>
                                <div className='alert-dialog-title'>Hint</div>
                                <div className='alert-dialog-content'> Hint for your password</div>
                                <div className='alert-dialog-footer'>
                                    {/* <button onClick={this.hideAlertDialog.bind(this)} className='alert-dialog-button'>Cancel</button> */}
                                    <button onClick={this.hideAlertDialog.bind(this)} className='alert-dialog-button'>Ok</button>
                                </div>
                            </Ons.AlertDialog>
                        </Row>
                    </section>
                    <Ons.Button onClick={this.handleSubmit.bind(this)}>Send Hycon</Ons.Button>
                </Page>
            </div>
        )
    }

    private renderRow(row: any, index: any) {
        return (
            <Ons.ListItem key={index} name={contacts[index].addr} >
                <div className='left'>
                    {contacts[index].name}
                </div>
                <div className='center' onClick={this.handleSelectedItem.bind(this)}>
                    {contacts[index].addr}
                </div>
            </Ons.ListItem>
        );
    }

    private handleSelectedItem(e: any) {
        this.setState({ address: e.target.innerText })
    }

    private setWallets(wallets: IHyconWallet[]) {
        this.setState({ wallets })
    }

    private onClickHint() {
        this.setState({ alertDialogShown: true })
    }

    private hideAlertDialog() {
        this.setState({ alertDialogShown: false });
    }

    private handleContacts() {
        this.setState({ contactsShown: true })
    }

    private handleContactsClose() {
        this.setState({ contactsShown: false });
    }



    private handleChange(e: any) {
        if (e.target.value.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            var val: String = e.target.value
            let str = val.substring(0, val.length - 1)
            e.target.value = str
            return
        } else {
            console.log("value : " + e.target.value)
            let val = e.target.value
            let left = this.state.totalMoney - this.state.amountSending
            if (val < 0) {
                val = 0
            } else if (val > left) {
                val = left
            }
            this.setState({ fee: val });
        }
    }

    private handleChangeAmount(e: any) {
        if (e.target.value.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            var val: String = e.target.value
            let str = val.substring(0, val.length - 1)
            e.target.value = str
            return
        } else {
            let val = e.target.value
            let left = this.state.totalMoney - val
            if (val < 0) {
                val = 0
            } else if (val > this.state.totalMoney) {
                val = this.state.totalMoney
            }
            this.setState({ amountSending: val });
        }
    }


    private handleSubmit(e: any) {
        if (this.state.amountSending <= 0) {
            alert("Enter a valid transaction amount")
            return
        }
        if (this.state.amountSending.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            return
        }
        if (this.hyconfromString(this.state.totalMoney).lessThan(this.hyconfromString(this.state.amountSending).add(this.hyconfromString(this.state.fee)))) {
            alert("You can't spend the money you don't have")
            return
        }
        if (this.hyconfromString(this.state.fee).equals(0)) {
            alert("Enter a valid miner fee")
            return
        }
        if (this.state.fromAddress === this.state.address) {
            alert("You cannot send HYCON to yourself")
            return
        }
        if (this.state.address === "" || this.state.address === undefined) {
            alert("Enter a to address")
            return
        }

    }

    private handleMaxClick(e: any) {
        this.setState({ amountSending: this.state.totalMoney });
    }

    private hyconfromString(val: string): Long {
        if (val === "" || val === undefined || val === null) { return Long.fromNumber(0, true) }
        if (val[val.length - 1] === ".") { val += "0" }
        const arr = val.toString().split(".")
        let hycon = Long.fromString(arr[0], true).multiply(Math.pow(10, 9))
        if (arr.length > 1) {
            arr[1] = arr[1].length > 9 ? arr[1].slice(0, 9) : arr[1]
            const subCon = Long.fromString(arr[1], true).multiply(Math.pow(10, 9 - arr[1].length))
            hycon = hycon.add(subCon)
        }
        return hycon.toUnsigned()
    }
}
