export const base64ToMB = (base64) => {

    base64.replace(/=/gm, '');
    return (3 * (base64.length / 4)) / 1000000;
}