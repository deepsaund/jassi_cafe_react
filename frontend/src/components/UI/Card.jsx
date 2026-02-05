import { useTheme } from '../../context/ThemeContext';

export const Card = ({ children, className = '' }) => {
    const { theme } = useTheme();
    const hasBg = className.includes('bg-');

    // Premium theme-aware shadows
    // In dark mode, we rely on subtle borders and very soft, transparent shadows to avoid "dirty" look
    const shadowClass = theme === 'dark'
        ? 'shadow-[0_8px_30px_rgb(0,0,0,0.1)]' // Ultra-subtle shadow for dark mode
        : 'shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)]';

    return (
        <div className={`rounded-[2rem] transition-all duration-500 ${!hasBg ? (theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-100') : ''} ${shadowClass} border ${className}`}>
            {children}
        </div>
    );
};
