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
    wallet: string
}
export class WalletView extends React.Component<IProps, IState & IProps> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
            // nextState derived from nextProps
            wallet: "H4PhGGqqkfmPu542EDHvVqtj9RYfA8BtQ",
        })
    }

    constructor(props: IProps) {
        super(props)
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public renderToolbar() {
        return (
            <Toolbar modifier="transparent noshadow">
                <Link to="/"><div className="left">Back</div></Link>
                <div className="center"></div>
                <div className="right">Delete</div>
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
                            value={this.state.wallet}
                            disabled
                        />
                    </Col>
                </Row>
                <ListItem modifier="chevron">
                    See Activity
                </ListItem>
                <ListItem modifier="chevron">
                    Send HYC
                </ListItem>
                <ListItem modifier="chevron">
                    Claim Wallet
                </ListItem>
            </Page>
        )
    }
}
