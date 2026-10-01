export function checkHeading(str) {
    return /^(\*|\s)*\*\*(.*?)\*(\*|\s)*$/.test(str)
}

export function replaceHeadingStarts(str) {
    return str.replace(/^(\*|\s)*\*\*(.*?)\*(\*|\s)*$/, '$2')
}