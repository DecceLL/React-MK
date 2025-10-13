const BASE_URL = "https://www.freetogame.com/api";

export async function fetchGames() {
    const response = await fetch(`${BASE_URL}/games`);
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data
}



export async function fetchGamesByPlatform() {
    const response = await fetch(`${BASE_URL}/games?platform`);
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
}