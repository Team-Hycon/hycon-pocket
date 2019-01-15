import * as React from "react"
import * as ReactDOM from "react-dom"
import { HashRouter } from "react-router-dom"
import { RestChrome } from "../restChrome"
import { MobileApp } from "./mobileClient"

document.addEventListener("deviceready", () => {
    const rest = new RestChrome()

    ReactDOM.hydrate(
        <HashRouter>
            <MobileApp rest={rest} />
        </HashRouter>,
        document.getElementById("blockexplorer"),
    )

    document.addEventListener("backbutton", (event) => {
        event.preventDefault()
        history.back()
        return
    }, false)

    AppRate.preferences = {
        displayAppName: 'Hycon Pocket',
        usesUntilPrompt: 5,
        promptAgainForEachNewVersion: true,
        inAppReview: true,
        useLanguage: "en",
        simpleMode: true,
        storeAppURL: {
            ios: 'io.hycon.litewallet',
            android: 'market://details?id=io.hycon.litewallet',
            windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
            blackberry: 'appworld://content/[App Id]/',
            windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
        },
        customLocale: {
            title: "Would you mind rating %@?",
            message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
            cancelButtonLabel: "No, Thanks",
            laterButtonLabel: "Remind Me Later",
            rateButtonLabel: "Rate It Now",
            yesButtonLabel: "Yes!",
            noButtonLabel: "Not really",
            appRatePromptTitle: 'Do you like using %@',
            appRatePromptMessage: 'If you like using this wallet please give us your feedback',
            feedbackPromptTitle: 'Mind giving us some feedback?',
            feedbackPromptMessage: 'Choose the option you prefer for giving us a feedback',
        },
        callbacks: {
            handleNegativeFeedback: function () {
                window.open('mailto:feedback@example.com', '_system');
            },
            onRateDialogShow: function (callback) {
                callback(1) // cause immediate click on 'Rate Now' button
            },
            onButtonClicked: function (buttonIndex) {
                console.log("onButtonClicked -> " + buttonIndex);
            },
            done: function () {
                console.log("feedback done");
            }
        }
    };
    AppRate.promptForRating(false);
}, false)
