function formatHumanReadable(text: string) {
    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/\(/g, ' (')
        .replace(/\)/g, ')')
        .split(/\s+/)
        .map(word => {
            if (word.startsWith('(')) {
                const inner = word.slice(1);
                if (inner === inner.toUpperCase() && inner.length > 1) {
                    return '(' + inner; // Keep acronyms in all caps
                }
                return '(' + inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
        .trim();
}

export { formatHumanReadable };