import crypto from 'crypto';

const N = 512; // Lattice dimension
const Q = 12289; // Prime modulus
const ERROR_BOUND = 10; // Error bound for LWE

const randomNumber = (bound: number): number => {
    return crypto.randomInt(0, bound);
};

const randomError = (): number => {
    return crypto.randomInt(-ERROR_BOUND, ERROR_BOUND + 1);
};

const generateSecretKey = (n: number = N): number[] => {
    return Array.from({ length: n }, () => randomNumber(Q));
};

const generatePublicKey = (s: number[], n: number = N): { A: number[]; b: number[] } => {
    const A = new Array(n);
    const b = new Array(n);
    for (let i = 0; i < n; i++) {
        A[i] = randomNumber(Q);
        b[i] = (A[i] * s[i] + randomError()) % Q;
        if (b[i] < 0) b[i] += Q;
    }
    return { A, b };
};

const encrypt = (
    A: number[],
    b: number[],
    m: number[],
    n: number = N
): { c1: number[]; c2: number[] } => {
    const c1 = new Array(n);
    const c2 = new Array(n);
    for (let i = 0; i < n; i++) {
        const e1 = randomError();
        const e2 = randomError();
        const e3 = randomError();
        c1[i] = (A[i] * e1 + e2) % Q;
        if (c1[i] < 0) c1[i] += Q;
        c2[i] = (b[i] * e1 + e3 + m[i]) % Q;
        if (c2[i] < 0) c2[i] += Q;
    }
    return { c1, c2 };
};

const decrypt = (c1: number[], c2: number[], s: number[], n: number = N): number[] => {
    const m = new Array(n);
    for (let i = 0; i < n; i++) {
        m[i] = (c2[i] - c1[i] * s[i]) % Q;
        if (m[i] < 0) m[i] += Q;
        m[i] = m[i] % 2; 
    }
    return m;
};

export { generateSecretKey, generatePublicKey, randomNumber, encrypt, decrypt };
