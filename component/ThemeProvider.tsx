import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import * as React from "react"
import { IRest } from "../../rest"
import MobileApp from "../mobileClient"

declare var window: any
const storage = window.localStorage
interface IProps {
    rest: IRest
}

export class ThemeProvider extends React.PureComponent<IProps, any> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            language: navigator.language.split("-")[0],
            paletteType: storage.getItem("paletteType") === null ? "light" : storage.getItem("paletteType"),
        }
    }

    public render() {
        const typography = {
            fontFamily: this.state.language === "en" ?
                ["Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(",") :
                ["Nanum Gothic", "Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(","),
            fontWeightLight: 400,
            fontWeightMedium: 400,
            fontWeightRegular: this.state.language === "en" ? 600 : 700,
            useNextVariants: true,
        }

        const overrides = {
            MuiFormLabel: {
                root: {
                    "&$focused": {
                        color: "#1ADAD8",
                    },
                },
            }, MuiInput: {
                underline: {
                    "&:after": {
                        borderBottom: "1px solid #1ADAD8",
                    },
                    "&:focused:not($disabled):after": {
                        borderBottom: "1px solid #1ADAD8",
                    },
                    "&:hover:not($disabled):after": {
                        borderBottom: "1px solid #1ADAD8",
                    },
                },
            }, MuiOutlinedInput: {
                root: {
                    "&$focused $notchedOutline": {
                        borderColor: "#1ADAD8",
                        borderWidth: 1,
                    },
                    "&$notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                },
            },
        }

        let theme: Theme

        if (this.state.paletteType === "light") {
            window.StatusBar.styleDefault()
            window.StatusBar.backgroundColorByHexString("#ededf3")
            theme = createMuiTheme({ overrides, palette: { type: "light" }, typography })
        } else {
            window.StatusBar.styleLightContent()
            window.StatusBar.backgroundColorByHexString("#212121")
            theme = createMuiTheme({ overrides, palette: { type: "dark" }, typography })
        }
        return (
            <MuiThemeProvider theme={theme}>
                <MobileApp
                    paletteType={this.state.paletteType}
                    rest={this.props.rest}
                    theme={theme}
                    changeLanguage={this.changeLanguage.bind(this)}
                    setPaletteType={this.setPaletteType.bind(this)}/>
            </MuiThemeProvider>
        )
    }

    private changeLanguage = (language: string) => {
        this.setState({ language })
    }

    private setPaletteType = () => {
        const paletteType = this.state.paletteType === "light" ? "dark" : "light"
        this.setState({ paletteType })
        storage.setItem("paletteType", paletteType)
    }
}
