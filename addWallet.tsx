import { notification } from "onsenui"
import * as React from "react"
import { Button, List, ListHeader, ListItem, Page, Toolbar, Icon, Row, Col, Input, Range, Select, Checkbox } from "react-onsenui"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"

var Ons = require('react-onsenui')

interface IProps {
    rest: IRest
    language: IText
}
// tslint:disable-next-line:no-empty-interface
interface IState {

}
export class AddWallet extends React.Component<IProps, any> {
    list: ['Advance options']

    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
        })
    }

    constructor(props: IProps) {
        super(props)
        this.state = {
            modifier: "en"
            , isMnemonic: false
        }
        // props.rest.getWalletList().then((w) => this.setWallets(w.walletList))
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public renderToolbar() {
        return (
            <Toolbar>
                <Link to="/"><div className="left">Back</div></Link>
                <div className="center">Add Wallet</div>
                <div className="right"></div>
            </Toolbar>
        )
    }

    public handleClick() {

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

    public renderForm() {
        return (
            <section>
                <Row>
                    <Col verticalAlign="center">
                        <Ons.Input type="text" placeholder='Wallet name' />
                    </Col>
                    <Col verticalAlign="center">
                        <Ons.Select value={this.state.modifier} modifier={this.state.modifier} onChange={this.editSelects}>
                            <option value="en">En</option>
                            <option value="kr">Kr</option>
                            <option value="jp">Jp</option>
                            <option value="fr">Fr</option>
                        </Ons.Select>
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <Ons.Input type="password" placeholder='Encrypt password' />
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <Ons.Input type="password" placeholder='Confirm password' />
                    </Col>
                </Row>

                <Row>
                    <Col verticalAlign="center">
                        <Ons.Checkbox /> Advance options
                            <Ons.Icon icon='md-delete' />

                    </Col>]
                    </Row>

                <Button onClick={this.generateWallet.bind(this)}>Send Hycon</Button>
            </section>
        )
    }

    public renderMnemonic() {
        return (
            <section>
                <p> Blablabla Mnemonic Blablabld dont lose it</p>
                <p> bonjour papa maman koala gorille fleur seitan aubergine herisson mamouth jaune chemise</p>
                <Ons.Input type="text" placeholder='Mnemonic' />
                <Ons.Button>Enter</Ons.Button>
            </section>
        )
    }

    public render() {
        console.log(this.state.isMnemonic)
        return (
            <div>
                <Page renderToolbar={() => this.renderToolbar()}>
                    {this.state.isMnemonic ? this.renderMnemonic() : this.renderForm()}
                </Page>
            </div>
        )
    }

    private editSelects(event: any) {
        this.setState({ modifier: event.target.value });
    }

    private generateWallet() {
        console.log("isMnemonic function update" + this.state.isMnemonic);
        this.setState({ isMnemonic: true })
    }
}
