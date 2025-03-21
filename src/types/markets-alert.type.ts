export interface Token {
    id: string;
    symbol: string;
    name: string;
    platforms?: Record<string, string>;
    thumb?: string;
    logo?: string;
}

export interface SearchableTokenSelectProps {
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}