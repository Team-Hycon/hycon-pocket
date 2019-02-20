import english from "./m_en"
import korean from "./m_kr"

export function getMobileLocale(code: string): IText {
    const locale = code.split("-")
    switch (locale[0]) {
        case "en": return english
        case "ko": return korean
        default: return english
    }
}
export interface IText {
    "grammar": string
    "currency": string
    "currency-symbol": string

    // Languages
    "lang-en": string
    "lang-fr": string
    "lang-sp": string
    "lang-ko": string
    "lang-cs": string
    "lang-ct": string
    "lang-ja": string
    "lang-it": string

    // Buttons
    "btn-get-started": string
    "btn-got-it": string
    "btn-continue": string
    "btn-finish": string
    "btn-create-wallet": string
    "btn-recover-wallet": string
    "btn-delete-wallet": string
    "btn-confirm": string
    "btn-add": string
    "btn-close": string
    "btn-max": string
    "btn-send": string
    "btn-request": string
    "btn-more": string
    "btn-qr": string
    "btn-create-qr": string
    "btn-login": string
    "btn-submit": string
    "btn-cancel": string
    "btn-yes": string
    "btn-show-me": string
    "btn-create-now": string
    "btn-create-later": string
    "btn-redeem": string
    "btn-dark-on": string,
    "btn-dark-off": string,

    // PLACEHOLDER / LABEL
    "ph-contact-name": string
    "ph-generated-mnemonic": string
    "ph-enter-mnemonic": string
    "ph-confirm-mnemonic": string
    "ph-wallet-name": string
    "ph-mnemonic-language": string
    "ph-password": string
    "ph-confirm-password": string
    "ph-advanced-options": string
    "ph-bip39": string
    "ph-wallet-address": string
    "ph-wallet-password": string
    "ph-amount": string
    "ph-fee": string
    "ph-amount-to-request": string
    "ph-email": string
    "ph-2fa": string
    "ph-press-back-again": string,

    // ON BOARDING
    "onboarding-step1-text1": string
    "onboarding-step1-text2": string
    "onboarding-step1-text3": string
    "onboarding-step2-text1": string
    "onboarding-step2-text2": string
    "onboarding-step2-text3": string
    "onboarding-step3-text1": string
    "onboarding-step3-text2": string
    "onboarding-step3-text3": string
    "onboarding-step4-text1": string
    "onboarding-step4-text2": string
    "onboarding-step4-text3": string
    "onboarding-step5-text1": string
    "onboarding-step5-text2": string
    "onboarding-step5-checkbox1": string
    "onboarding-step5-checkbox2": string
    "onboarding-step5-checkbox3": string

    // REVIEW POPUP
    "review-prompt-message": string,
    "review-prompt-title": string,
    "review-cancel-button": string,
    "review-feedback-prompt-message": string,
    "review-feedback-prompt-title": string,
    "review-later-button": string,
    "review-message": string,
    "review-no-button": string,
    "review-rate-button": string,
    "review-title": string,
    "review-yes-button": string,

    // HOME
    "wallet-list": string
    "home-guide-add-wallet": string
    "home-guide-tap-plus": string
    "home-add-another-wallet": string,

    // CONTACTS
    "contacts-title": string
    "contacts-list": string
    "contacts-empty": string
    "contacts-action": string

    // CREATE / RECOVER WALLET
    "common-title": string
    "common-advanced-options-hint1": string
    "common-advanced-options-hint2": string
    "common-select-create-or-recover": string
    "create-type-mnemonic": string
    "create-what-is-this": string
    "create-answer-what-is-this": string
    "create-retype-mnemonic": string
    "create-success": string
    "recover-type-mnemonic": string
    "recover-success": string

    // WALLET DETIAL
    "detail-no-data": string
    "title-wallet": string
    "detail-your-balance": string
    "datail-balance-tooltip": string
    "show-mnemonic": string
    "display-mnemonic": string
    "enter-password": string
    "your-mnemonic-is": string
    "erase-recover-wallet": string
    "wallet-settings": string
    "set-tx-speed": string
    "set-tx-speed-help": string
    "set-tx-speed-disabled-help": string
    "detail-last": string
    "detail-txs": string
    "detail-amount": string
    "detail-fee": string
    "detail-from": string
    "detail-to": string
    "detail-hash": string
    "detail-guide-make-your-tx": string
    "detail-guide-tap-send-or-request": string
    "detail-share-qr": string
    "detail-request-share-qr": string
    "alert-delete-wallet": string
    "detail-delete-wallet": string
    "balance-hidden": string
    "txs-hidden": string
    "txs-hidden-help": string
    "no-wallet": string,
    "no-wallet-action": string,

    // WALLET DETAIL - ACTIVITY
    "activity-title": string
    "activity-txs": string
    "activity-completed": string
    "activity-pending": string
    "activity-received": string
    "activity-sent": string
    "activity-mining-reward": string
    "activity-miner-address": string
    "tx-completed": string
    "tx-pending": string
    "tx-receive": string
    "tx-send": string
    "tx-giftcard": string
    "redeem-giftcard": string

    // GIFTCARD
    "title-redeem-giftcard": string
    "gc-number": string
    "gc-pin": string
    "gc-pin-placeholder": string

    // WALLET DETAIL - SEND HYCON
    "send-hyc-title": string
    "send-hyc-how-it-works": string
    "send-hyc-answer-how-it-works": string
    "send-hyc-tx-status": string
    "send-hyc-success": string
    "send-hyc-fail": string
    "send-hyc-add-contact": string
    "send-hyc-select-address": string
    "send-hyc-add-contact-hint": string
    "fee-helper-text": string

    // WALLET DETAIL - REQUEST HYCON
    "request-hyc-title": string

    // WALLET DETAIL - CLAIM WALLET
    "claim-title": string
    "claim-success": string

    // HELP
    "check-all": string
    "help-notification": string
    "help-comming-soon": string
    "help-copied": string
    "help-refreshed": string

    // ALERT / CONFIRM
    "confirm-add-address-to-contact": string
    "alert-enter-name": string
    "alert-invalid-name": string
    "alert-enter-address": string
    "alert-invalid-address": string
    "alert-contact-address-duplicate": string
    "alert-wallet-name-no-space": string
    "alert-password-not-match": string
    "confirm-password-null": string
    "alert-wallet-name-duplicate": string
    "alert-error-add-wallet": string
    "alert-mnemonic-not-match": string
    "alert-mnemonic-lang-not-match": string
    "alert-wallet-address-duplicate": string
    "alert-recover-fail": string
    "alert-delete-wallet-fail": string
    "alert-9decimal-amount": string
    "alert-9decimal-fee": string
    "alert-invalid-amount": string
    "alert-insufficient-balance": string
    "alert-invalid-fee": string
    "alert-cannot-send-yourself": string
    "alert-enter-to": string
    "alert-invalid-email": string
    "alert-invalid-password": string
    "alert-enter-password": string
    "alert-claim-fail": string
    "alert-invalid-2fa": string
    "alert-cannot-find-account": string
    "alert-error-show-mnemonic": string
    "alert-unknown-error-show-mnemonic": string
    "alert-gc-enter-cardnumber": string
    "alert-gc-enter-16-digit": string
    "alert-gc-enter-pin": string
    "alert-gc-internal-server-error": string
    "alert-gc-redeemed": string
    "alert-gc-invalid-info": string
    "alert-gc-already-redeemed": string

    // SETTINGS
    "settings-title": string
    "settings-general": string
    "settings-security": string,
    "fingerprint-on-launch": string,
    "disable": string,
    "enable": string,
    "disabled": string,
    "enabled": string,
    "hide-balance": string
    "show-balance": string
    "one-handed-on": string,
    "one-handed-off": string,
    "set-tx-speed-global-help": string
    "settings-about": string
    "settings-support": string
    "settings-app-version": string
    "settings-copyright": string
    "settings-copyright-hycon": string
    "settings-feedback": string

    // FEE SETTINGS
    "option-fee-faster": string
    "option-fee-fast": string
    "option-fee-normal": string
    "option-fee-manually": string
    "option-fee-general": string
    "set-fee-all-wallets": string
    "set-fee-for": string

    // FINGERPRINT SETTINGS
    "fingerprint-text1": string,
    "fingerprint-text2": string,

    // TERMS OF USE
    "terms-of-use": string
    "terms-of-use-text1": string
    "terms-of-use-subtitle1": string
    "terms-of-use-text2": string
    "terms-of-use-text3": string
    "terms-of-use-text4": string
    "terms-of-use-text5": string
    "terms-of-use-subtitle2": string
    "terms-of-use-text6": string
    "terms-of-use-subtitle3": string
    "terms-of-use-text7": string
    "terms-of-use-subtitle4": string
    "terms-of-use-text8": string
    "terms-of-use-subtitle5": string
    "terms-of-use-text9": string
    "terms-of-use-revision-date": string

    // PRIVACY POLICY
    "privacy-policy": string
    "privacy-policy-intro": string
    "privacy-policy-log-data": string
    "privacy-policy-log-data-content": string
    "privacy-policy-cookies": string
    "privacy-policy-cookies-content1": string
    "privacy-policy-cookies-content2": string
    "privacy-policy-cookies-purpose1": string
    "privacy-policy-cookies-purpose2": string
    "privacy-policy-ga": string
    "privacy-policy-ga-content1": string
    "privacy-policy-ga-content2": string
    "privacy-policy-ga-content3": string
    "privacy-policy-changes": string
    "privacy-policy-changes-content": string
    "privacy-policy-revision-date": string

    // CHANGELOG
    "changelog": string
    "changelog-whats-new": string
    "changelog-100": string
    "changelog-100-content": string
    "changelog-101": string
    "changelog-101-content1": string
    "changelog-101-content2": string
    "changelog-101-content3": string
    "changelog-111": string
    "changelog-111-content1": string
    "changelog-111-content2": string
    "changelog-111-content3": string
    "changelog-111-content4": string
    "changelog-111-content5": string
    "changelog-111-content6": string
    "changelog-111-content7": string
    "changelog-111-content8": string
    "changelog-112": string
    "changelog-112-content1": string
    "changelog-112-content2": string
    "changelog-112-content3": string
    "changelog-112-content4": string
    "changelog-112-content5": string
    "changelog-112-content6": string
    "changelog-112-content7": string
    "changelog-112-content8": string
    "changelog-112-content9": string
    "changelog-112-content10": string
    "changelog-112-content11": string
    "changelog-112-content12": string
    "changelog-112-content13": string
    "changelog-120-content1": string
    "changelog-120-content2": string
    "changelog-120-content3": string
    "changelog-120-content4": string
}
