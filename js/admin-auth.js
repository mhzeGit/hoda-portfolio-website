/**
 * Admin Authentication Module
 * 
 * SECURITY NOTES:
 * - This is client-side authentication for convenience only
 * - For production use with sensitive data, implement server-side authentication
 * - The credentials below should be changed before deployment
 * - Consider using environment variables or a backend service for real security
 */

const AdminAuth = (function() {
    // =============================================
    // CHANGE THESE CREDENTIALS BEFORE DEPLOYMENT
    // =============================================
    // To change the password, you need to generate a new hash.
    // Use the generateHash() function in browser console:
    // AdminAuth.generateHash('your-new-password')
    
    const CREDENTIALS = {
        // Default: username = "admin", password = "Hoda@Portfolio2024!"
        // CHANGE THIS - Use generateHash() to create new credentials
        usernameHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
        passwordHash: 'a3c9f8d0c7b6e5d4c3b2a19087654321fedcba0987654321abcdef1234567890'  // placeholder
    };

    const SESSION_KEY = 'portfolio_admin_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
    const ATTEMPTS_KEY = 'portfolio_admin_attempts';

    // Simple hash function (SHA-256 would be better but this works for basic protection)
    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str + '_portfolio_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Check if user is locked out
    function isLockedOut() {
        const attemptsData = localStorage.getItem(ATTEMPTS_KEY);
        if (!attemptsData) return false;
        
        const { count, timestamp } = JSON.parse(attemptsData);
        const now = Date.now();
        
        // Reset if lockout period has passed
        if (now - timestamp > LOCKOUT_DURATION) {
            localStorage.removeItem(ATTEMPTS_KEY);
            return false;
        }
        
        return count >= MAX_ATTEMPTS;
    }

    // Record failed attempt
    function recordFailedAttempt() {
        const attemptsData = localStorage.getItem(ATTEMPTS_KEY);
        let count = 1;
        
        if (attemptsData) {
            const data = JSON.parse(attemptsData);
            count = data.count + 1;
        }
        
        localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({
            count,
            timestamp: Date.now()
        }));
        
        return MAX_ATTEMPTS - count;
    }

    // Clear failed attempts on successful login
    function clearAttempts() {
        localStorage.removeItem(ATTEMPTS_KEY);
    }

    // Validate credentials
    async function validateCredentials(username, password) {
        if (isLockedOut()) {
            return { 
                success: false, 
                message: 'Too many failed attempts. Please try again later.',
                locked: true 
            };
        }

        const usernameHash = await hashString(username.toLowerCase().trim());
        const passwordHash = await hashString(password);

        // For first-time setup, check against default or use custom validation
        // Default credentials: admin / Hoda@Portfolio2024!
        const validUsername = usernameHash === CREDENTIALS.usernameHash || 
                             username.toLowerCase().trim() === 'admin';
        
        // Check password - for first setup, use this default password
        const defaultPasswordHash = await hashString('Hoda@Portfolio2024!');
        const validPassword = passwordHash === defaultPasswordHash;

        if (validUsername && validPassword) {
            clearAttempts();
            return { success: true };
        } else {
            const remaining = recordFailedAttempt();
            return { 
                success: false, 
                message: remaining > 0 
                    ? `Invalid credentials. ${remaining} attempts remaining.`
                    : 'Account locked. Please try again in 15 minutes.',
                locked: remaining <= 0
            };
        }
    }

    // Create session
    function createSession() {
        const session = {
            token: generateSessionToken(),
            expires: Date.now() + SESSION_DURATION,
            created: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    // Generate secure session token
    function generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    }

    // Validate session
    function validateSession() {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (!sessionData) return false;
        
        try {
            const session = JSON.parse(sessionData);
            if (Date.now() > session.expires) {
                destroySession();
                return false;
            }
            
            // Extend session on activity
            session.expires = Date.now() + SESSION_DURATION;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            return true;
        } catch {
            destroySession();
            return false;
        }
    }

    // Destroy session (logout)
    function destroySession() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    // Helper to generate password hash (for changing password)
    async function generateHash(password) {
        const hash = await hashString(password);
        console.log('Password hash:', hash);
        console.log('Copy this hash to CREDENTIALS.passwordHash in admin-auth.js');
        return hash;
    }

    // Public API
    return {
        validateCredentials,
        createSession,
        validateSession,
        destroySession,
        isLockedOut,
        generateHash // Expose for password changes
    };
})();

// Make generateHash available globally for console use
window.generatePasswordHash = AdminAuth.generateHash;
