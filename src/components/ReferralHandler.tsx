import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Constants for storage keys and settings
const REFERRAL_CODE_KEY = 'dexfin_referral_code';
const REFERRAL_EXPIRY_KEY = 'dexfin_referral_expiry';
const REFERRAL_EXPIRY_DAYS = 30;

/**
 * Component that handles referral code logic from URL parameters
 */
const ReferralHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [processed, setProcessed] = useState(false);

    // This effect runs once on initial mount to handle the URL parsing
    useEffect(() => {
        // Only process if we haven't already done it
        if (processed) return;

        const processReferralCode = () => {
            // Handle /ref/CODE format
            if (location.pathname.startsWith('/ref/')) {
                try {
                    // Extract code from URL path
                    const parts = location.pathname.split('/');
                    if (parts.length >= 3) {
                        const referralCode = parts[2];
                        
                        // Skip if code is empty
                        if (!referralCode) return;
                        
                        console.log("Found referral code:", referralCode);
                        
                        // Set expiration date (30 days from now)
                        const expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);
                        
                        // Save to localStorage
                        localStorage.setItem(REFERRAL_CODE_KEY, referralCode);
                        localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.toString());
                        
                        // Mark as processed to prevent duplicate processing
                        setProcessed(true);
                        
                        // Redirect to home page after a short delay
                        // Delay ensures localStorage is set before navigation
                        setTimeout(() => {
                            navigate('/', { replace: true });
                        }, 100);
                    }
                } catch (error) {
                    console.error("Error processing referral:", error);
                }
            }
            
            // Handle ?ref=CODE format in query parameters
            const urlParams = new URLSearchParams(location.search);
            const queryRefCode = urlParams.get('ref');
            
            if (queryRefCode) {
                try {
                    console.log("Found referral code in query:", queryRefCode);
                    
                    // Set expiration date
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);
                    
                    // Save to localStorage
                    localStorage.setItem(REFERRAL_CODE_KEY, queryRefCode);
                    localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.toString());
                    
                    // Mark as processed
                    setProcessed(true);
                    
                    // Clean up URL by removing ref parameter
                    urlParams.delete('ref');
                    const newUrl = urlParams.toString() 
                        ? `${location.pathname}?${urlParams.toString()}`
                        : location.pathname;
                    
                    // Navigate to the clean URL
                    setTimeout(() => {
                        navigate(newUrl, { replace: true });
                    }, 100);
                } catch (error) {
                    console.error("Error processing referral from query:", error);
                }
            }
        };
        
        // Process immediately
        processReferralCode();
    }, [location, navigate, processed]);

    // No visible UI needed
    return null;
};

/**
 * Get the stored referral code if it's still valid
 * @returns The referral code or null if not found or expired
 */
export function getReferralCodeFromStorage(): string | null {
    const code = localStorage.getItem(REFERRAL_CODE_KEY);
    const expiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);

    if (code && expiry) {
        const expiryDate = new Date(expiry);
        if (expiryDate > new Date()) {
            return code;
        } else {
            // Clean up expired referral data
            clearReferralCode();
        }
    }

    return null;
}

/**
 * Clear all referral data from local storage
 */
export function clearReferralCode(): void {
    localStorage.removeItem(REFERRAL_CODE_KEY);
    localStorage.removeItem(REFERRAL_EXPIRY_KEY);
}

export default ReferralHandler;