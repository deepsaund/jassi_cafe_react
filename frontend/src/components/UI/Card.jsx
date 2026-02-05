import { useTheme } from '../../context/ThemeContext';

export const Card = ({ children, className = '' }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const hasBg = className.includes('bg-');

    // Premium theme-aware shadows
    const shadowClass = isDark
        ? 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-white/[0.05]'
        : 'shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] border-slate-200/60';

    const bgClass = !hasBg
        ? (isDark ? 'bg-secondary-darker' : 'bg-white')
        : '';

    return (
        <div className={`rounded-[2.5rem] transition-all duration-700 ${bgClass} ${shadowClass} border ${className}`}>
            {children}
        </div>
    );
};
