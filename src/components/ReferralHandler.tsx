import { useEffect } from 'react';
import { useStore } from '../store/useStore';
const REFERRAL_CODE_KEY = 'dexfin_referral_code';
const REFERRAL_EXPIRY_KEY = 'dexfin_referral_expiry';
const REFERRAL_EXPIRY_DAYS = 30;

const ReferralHandler = () => {
    const { setIsSignupModalOpen } = useStore();

    useEffect(() => {
        const processReferralCode = async () => {
            const url = window.location.href;
            const regexMatch = url.match(/\/ref\/([A-Z0-9]+)/i);

            if (regexMatch && regexMatch[1]) {
                const referralCode = regexMatch[1];
                console.log(referralCode)
                try {
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);

                    localStorage.setItem(REFERRAL_CODE_KEY, referralCode);
                    localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.toString());

                    window.history.replaceState({}, document.title, '/');
                } catch (error) {
                    console.error('Invalid referral code:', error);
                    window.history.replaceState({}, document.title, '/');
                }
            }
        };

        processReferralCode();
    }, [setIsSignupModalOpen]);

    return null;
};

export function getReferralCodeFromStorage(): string | null {
    const code = localStorage.getItem(REFERRAL_CODE_KEY);
    const expiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);

    if (code && expiry) {
        const expiryDate = new Date(expiry);
        if (expiryDate > new Date()) {
            return code;
        } else {
            localStorage.removeItem(REFERRAL_CODE_KEY);
            localStorage.removeItem(REFERRAL_EXPIRY_KEY);
        }
    }

    return null;
}

export function clearReferralCode(): void {
    localStorage.removeItem(REFERRAL_CODE_KEY);
    localStorage.removeItem(REFERRAL_EXPIRY_KEY);
}

export default ReferralHandler;