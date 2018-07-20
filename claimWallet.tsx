import * as React from "react"
import { Button, Col, Input, List, ListHeader, ListItem, Page, Row, Toolbar } from "react-onsenui"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IRest } from "../rest"

interface IProps {
    rest: IRest
    language: IText
}
// tslint:disable-next-line:no-empty-interface
interface IState {
    email: string
    password: string
}
export class ClaimWallet extends React.Component<IProps, IState & IProps> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
            // nextState derived from nextProps
            email: "",
            password: "",
        })
    }

    constructor(props: IProps) {
        super(props)
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public handleEmailChange(event: any) {
        this.setState({ email: event.target.value })
        console.log(event)
    }

    public handlePasswordChange(event: any) {
        this.setState({ password: event.target.value })
        console.log(event)
    }

    public renderToolbar() {
        return (
            <Toolbar modifier="transparent noshadow">
                <Link to="/wallet"><div className="left">Back</div></Link>
                <div className="center">Claim Wallet</div>
                <div className="right"></div>
            </Toolbar>
        )
    }

    public render() {
        return (
            <Page renderToolbar={() => this.renderToolbar()}>
                <Row>
                    <Col verticalAlign="center">
                        Wallet Name
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <Input
                            modifier="underbar"
                            type="text"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col verticalAlign="center">
                        <Input
                            modifier="underbar"
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleEmailChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Link to="/confirmClaim">
                        <Button modifier="large"> Submit </Button>
                    </Link>
                </Row>
            </Page>
        )
    }
}
