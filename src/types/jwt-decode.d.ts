declare module "jwt-decode" {
    export interface JwtPayload {
        iss?: string;
        sub?: string;
        aud?: string[] | string;
        exp?: number;
        nbf?: number;
        iat?: number;
        jti?: string;
    }

    export interface JwtHeader {
        typ?: string;
        alg?: string;
        kid?: string;
    }

    export function jwtDecode<T = JwtHeader>(token: string, options?: { header: true }): T;
    export function jwtDecode<T = JwtPayload>(token: string, options?: { header?: boolean }): T;

    // Default export for compatibility if needed, though v4 uses named
    // export default jwtDecode; 
}
