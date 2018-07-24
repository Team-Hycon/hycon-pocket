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
const scale = 9 * Math.log(10) / 100

const contacts = [{ name: "Cat", addr: "H123fj43333ffgewf" }, { name: "Sansa", addr: "H123fj43kl23j08hf" }, { name: "Rob", addr: "H90lfgd5r67koaq0" },
{ name: "Ned", addr: "H123fj43333ffgewf" }, { name: "Arya", addr: "H123fj43kl23j08hf" }, { name: "John", addr: "H90lfgd5r67koaq0" }]

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
            fee: 1,
            feeVal: 1,
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
                                <Ons.Input type="number" placeholder='amount' value={this.state.amountSending} onChange={this.handleChangeAmount.bind(this)} /> <text>HYC</text>
                            </Col>
                        </Row>
                    </section>
                    <section>
                        <p>FEE</p>
                        <Row>
                            <Col verticalAlign="center">
                                <Ons.Input type="text" placeholder='fee' value={this.state.feeVal} onChange={this.handleChangeInput.bind(this)} /> <text>HYC</text>
                            </Col>
                        </Row>
                        <Row>
                            <Col verticalAlign="center">
                                <span>0 </span>
                                <Ons.Range
                                    min={0} Max={100}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.fee}
                                />
                                <span> 1</span>
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
            console.log("value entered : " + e.target.value)

            let val = e.target.value

            let feeValue = (Math.exp(scale * val) / 10e8);

            console.log("value fee : " + e.target.value)
            console.log("value feeVal : " + feeValue.toFixed(9))
            this.setState({ fee: val, feeVal: feeValue.toFixed(9) });
        }
    }

    private handleChangeInput(e: any) {
        console.log("value  entered: " + e.target.value)
        let val = e.target.value
        let feeValue = (Math.log(10e8 * val) / scale);
        console.log("value fee : " + Math.round(feeValue))
        console.log("value feeVal : " + e.target.value)
        this.setState({ fee: Math.round(feeValue), feeVal: val });
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
            } else if (val >= this.state.totalMoney) {
                alert("You dont have anough hycons for the transaction")
            }
            this.setState({ amountSending: val });
        }
    }


    private handleSubmit(e: any) {

        let sending = Number(this.state.amountSending) + Number(this.state.feeVal)
        let left = Number(this.state.totalMoney) - Number(sending)


        console.log("User send : " + sending
            + " Hyc. Amount is " + this.state.amountSending + " and miner fee is " + this.state.feeVal +
            " so we have now " + left + " left.")


        if (this.state.amountSending <= 0) {
            alert("Enter a valid transaction amount")
            return
        }
        if (this.state.amountSending.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            return
        }
        if (this.hyconfromString(this.state.totalMoney).lessThan(this.hyconfromString(this.state.amountSending).add(this.hyconfromString(this.state.feeVal)))) {
            alert("You can't spend the money you don't have")
            return
        }
        if (this.hyconfromString(this.state.feeVal).equals(0) || this.state.feeVal.match(pattern1) == null) {
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

        console.log("User send : " + this.hyconfromString(this.state.amountSending).add(this.hyconfromString(this.state.feeVal))
            + " Hyc. Amount is " + this.hyconfromString(this.state.amountSending) + " and miner fee is " + this.hyconfromString(this.state.feeVal))

    }

    private handleMaxClick(e: any) {
        let max = Number(this.state.totalMoney) - 0.0001
        let minerFee = 0.0001
        let displayFee = Math.round(Math.log(10e8 * minerFee) / scale)
        this.setState({ amountSending: max.toString(), fee: displayFee, feeVal: minerFee.toString() });
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
