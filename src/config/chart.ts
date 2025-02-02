export const CHART_COLORS = {
    background: '#000000',
    grid: '#222222',
    text: 'rgba(156, 163, 175, 1)',
    primary: '#3b82f6',
    success: 'rgba(34, 197, 94, 1)',
    error: 'rgba(239, 68, 68, 1)',
} as const;

export const CHART_STYLES = {
    tooltip: {
        contentStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            color: CHART_COLORS.text,
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            fontFamily: 'Exo, system-ui, sans-serif',
            fontSize: '13px',
        },
    },
    transitions: {
        duration: '300ms',
        timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
        exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
} as const;