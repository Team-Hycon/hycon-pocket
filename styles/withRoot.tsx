import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import * as React from "react"

function withRoot<P>(Component: React.ComponentType<P>, styleType?: string) {
    console.log("styleType: " + styleType)
    function WithRoot(props: P, type?: string) {
        let theme: any

        { type === "light" ?
            theme = createMuiTheme({
                palette: {
                    type: "light",
                },
                typography: {
                    fontFamily: [
                        "Open Sans",
                        "Helvetica",
                        "Arial",
                        "sans-serif",
                    ].join(","),
                    fontWeightLight: 400,
                    fontWeightMedium: 500,
                    fontWeightRegular: 600,
                    useNextVariants: true,
                },
            }) :
            theme = createMuiTheme({
                palette: {
                    type: "dark",
                },
                typography: {
                    fontFamily: [
                        "Open Sans",
                        "Helvetica",
                        "Arial",
                        "sans-serif",
                    ].join(","),
                    fontWeightLight: 400,
                    fontWeightMedium: 500,
                    fontWeightRegular: 600,
                    useNextVariants: true,
                },
            })
        }

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...props} />
            </MuiThemeProvider>
        )
    }

    return WithRoot
}

export default withRoot
