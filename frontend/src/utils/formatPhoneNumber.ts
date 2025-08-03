export const formatPhoneNumber = (value: string): string => {
    const numbersOnly = value.replace(/\D/g, '');

    if (numbersOnly.length < 4) return numbersOnly;
    if (numbersOnly.length < 8)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
};
