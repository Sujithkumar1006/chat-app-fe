import { fetchWrapper } from './fetchUtils'

export const syncAuth0ToServer = async (user: any) => {
    try {
        const response = await fetchWrapper('http://localhost:3001/api/user/syncUser', 'POST', user)
        if (response.ok) return true;
        else return false;
    }
    catch (err) {
        return false;
    }

}

export function formatChatTimestamp(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (isSameDay(date, now)) {
        return "Today";
    } else if (isSameDay(date, yesterday)) {
        return "Yesterday";
    } else if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" }); // Apr 10
    } else {
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); // Apr 10, 2024
    }
}