import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import * as React from "react"
import { IText } from "../locales/m_locales"

const storage = window.localStorage

interface IProps {
    language: IText
    name: string
}

export class FeeSettings extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)

        const wallets = JSON.parse(storage.getItem("/wallets"))

        if (!wallets) {
            const obj = {}
            obj[""] = { miningFee: ""}
            storage.setItem("/wallets", JSON.stringify(obj))
        }

        this.state = {
            anchorEl: null,
            options: [
                { label: this.props.language["option-fee-faster"] + " (10 HYC)", value: "10" },
                { label: this.props.language["option-fee-fast"] + " (1 HYC)", value: "1" },
                { label: this.props.language["option-fee-normal"] + " (0.000000001 HYC)", value: "0.000000001" },
                { label: this.props.name === "" ? this.props.language["option-fee-manually"] : this.props.language["option-fee-general"], value: "" },
            ],
        selectedIndex: 0,
            settings: JSON.parse(storage.getItem("/wallets"))[this.props.name],
        }
    }

    public componentDidMount() {
        if (this.state.settings !== undefined) {
            const index = this.state.options.findIndex((option, i) => {
                return option.value === this.state.settings.miningFee
            })
            this.setState({ selectedIndex: index })
        }
    }

    public render() {
        return (
            <div>
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Set defult fee for all wallets to"
                    onClick={this.handleClickListItem}
                >
                    <ListItemText
                        primary={this.props.name === ""
                            ? this.props.language["set-fee-all-wallets"]
                            : this.props.language.grammar === "reverse"
                                ? this.props.name + this.props.language["set-fee-for"]
                                : this.props.language["set-fee-for"] + this.props.name
                        }
                        secondary={this.state.options[this.state.selectedIndex].label}
                    />
                </ListItem>
                <Menu
                    id="lock-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    {this.state.options.map((option, index) => (
                        <MenuItem
                            key={option.label}
                            selected={index === this.state.selectedIndex}
                            onClick={(event) => this.handleMenuItemClick(event, index)}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }

    private handleClickListItem = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }

    private handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, anchorEl: null })

        const walletSet = JSON.parse(storage.getItem("/wallets"))
        walletSet[this.props.name] = { miningFee: this.state.options[index].value }
        storage.setItem("/wallets", JSON.stringify(walletSet))
    }

    private handleClose = () => {
        this.setState({ anchorEl: null })
    }
}
