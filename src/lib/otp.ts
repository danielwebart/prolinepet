import { TOTP, NobleCryptoPlugin, ScureBase32Plugin } from 'otplib';

// Create a TOTP instance with default options compatible with Google Authenticator
// (period: 30s, digits: 6, algorithm: sha1)
// We must provide crypto and base32 plugins for otplib v13
const totp = new TOTP({
    period: 30,
    crypto: new NobleCryptoPlugin(),
    base32: new ScureBase32Plugin()
});

export const authenticator = {
    /**
     * Generate a new secret key
     */
    generateSecret: () => totp.generateSecret(),

    /**
     * Generate a Google Authenticator compatible otpauth URL
     */
    keyuri: (user: string, service: string, secret: string) => {
        return totp.toURI({
            label: user,
            issuer: service,
            secret
        });
    },

    /**
     * Verify a token against a secret
     */
    verify: async (options: { token: string; secret: string }) => {
        // verify returns a Promise<VerifyResult> in v13
        // Using window: 1 allows for ±30s clock skew
        try {
            const isValid = await totp.verify(options.token, { 
                secret: options.secret,
                window: 1
            } as any);
            return isValid;
        } catch (e) {
            console.error('TOTP verify error:', e);
            return false;
        }
    }
};
