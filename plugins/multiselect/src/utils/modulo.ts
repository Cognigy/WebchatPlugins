export default function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}
