import * as React from "react"
import * as ReactDOM from "react-dom"
import { HashRouter } from "react-router-dom"
import { RestChrome } from "../restChrome"
import { ThemeProvider } from "./component/ThemeProvider"
import { getMobileLocale } from "./locales/m_locales"

declare let window: any
declare let navigator: any

document.addEventListener("deviceready", () => {
    const rest = new RestChrome()
    const language = getMobileLocale(navigator.language)

    ReactDOM.render(
        <HashRouter>
            <ThemeProvider rest={rest} />
        </HashRouter>,
        document.getElementById("blockexplorer"),
    )

    window.AppRate.preferences = {
        callbacks: {
            onRateDialogShow(callback) {
                console.log("onRateDialogShow")
            },
            onButtonClicked(buttonIndex) {
                console.log("onButtonClicked -> " + buttonIndex)
            },
            done() {
                console.log("feedback done")
            },
        },
        customLocale: {
            appRatePromptMessage: language["review-prompt-message"],
            appRatePromptTitle: language["review-prompt-title"],
            cancelButtonLabel: language["review-cancel-button"],
            feedbackPromptMessage: language["review-feedback-prompt-message"],
            feedbackPromptTitle: language["review-feedback-prompt-title"],
            laterButtonLabel: language["review-later-button"],
            message: language["review-message"],
            noButtonLabel: language["review-no-button"],
            rateButtonLabel: language["review-rate-button"],
            title: language["review-title"],
            yesButtonLabel: language["review-yes-button"],
        },
        displayAppName: "Hycon Pocket",
        inAppReview: true,
        promptAgainForEachNewVersion: true,
        simpleMode: true,
        storeAppURL: {
            android: "market://details?id=io.hycon.litewallet",
            blackberry: "appworld://content/[App Id]/",
            ios: "1439548798",
            windows: "ms-windows-store://pdp/?ProductId=<the apps Store ID>",
            windows8: "ms-windows-store:Review?name=<the Package Family Name of the application>",
        },
        useLanguage: "en",
        usesUntilPrompt: 5,
    }
    window.AppRate.promptForRating(false)

}, false)
