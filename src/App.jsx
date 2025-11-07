import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [platform, setPlatform] = useState("all");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 14;
    const [search, setSearch] = useState("");
    const [hoverVideo, setHoverVideo] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        let url = "/api/games";
        const params = new URLSearchParams();

        if (platform !== "all") params.set("platform", platform);
        if (category !== "all") params.set("category", category);
        if (sort !== "all") params.set("sort-by", sort);

        if (params.toString()) url += "?" + params.toString();

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setGames(data);
                } else {
                    setGames([]);
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setLoading(false);
                setCurrentPage(1)
            });
    }, [platform, category, sort]);

    const resetFilters = () => {
        setPlatform("all");
        setCategory("all");
        setSort("all");
        setSearch("")
    };

    const PlatformFilter = ({ value, onChange }) => (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="all">Все платформы</option>
            <option value="pc">Игры для ПК</option>
            <option value="browser">Браузерные игры</option>
        </select>
    );

    const CategoryFilter = ({ value, onChange }) => (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="all">Все категории</option>
            <option value="mmorpg">ММОРПГ</option>
            <option value="shooter">Шутер</option>
            <option value="mmo">ММО</option>
            <option value="strategy">Стратегии</option>
            <option value="moba">МОВА</option>
            <option value="battle-royale">Королевская Битва</option>
            <option value="card">Карточные</option>
            <option value="racing">Гонки</option>
            <option value="sports">Спортивные</option>
            <option value="social">Социальные</option>
            <option value="fighting">Файтинги</option>
        </select>
    );

    const SortFilter = ({ value, onChange }) => (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="all">Сортировка</option>
            <option value="release-date">По дате выхода</option>
            <option value="popularity">По популярности</option>
            <option value="alphabetical">По алфавиту</option>
        </select>
    );

    const filteredGames = games.filter((games) => games.title.toLowerCase().includes(search.toLowerCase()));
    const lastGameIndex = currentPage * gamesPerPage
    const firstGameIndex = lastGameIndex - gamesPerPage
    const currentGames = filteredGames.slice(firstGameIndex, lastGameIndex)
    const totalPages = Math.ceil(games.length / gamesPerPage)

    const Pagination = ({ currentPage, totalPages, onPageChange}) => {
        if (totalPages <= 1) return null;
            const pages = Array.from({length: totalPages}, (_, i) => i + 1);
        return (
            <div className={"pagination"}>
                <button className= "page-btn"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}>
                    Назад
                </button>

                {pages.map((page) => (
                    <button key={page}
                            className={`page-btn ${page === currentPage ? "active" : ""}`}
                            onClick={() => onPageChange(page)}>
                        {page}
                    </button>
                ))}
                <button className={"page-btn"}
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}>
                    Вперед
                </button>
            </div>
        )
    }

    return (
        <div className="app">

            <h1>Список игр</h1>
            <div className={"filters"}>
                <input type={"text"} value={search} placeholder={"Поиск игры..."}
                       onChange={(e) => setSearch(e.target.value)}/>
                <PlatformFilter value={platform} onChange={setPlatform}/>
                <CategoryFilter value={category} onChange={setCategory}/>
                <SortFilter value={sort} onChange={setSort}/>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
                <button className={"reset-button"} onClick={resetFilters}>Сбросить фильтры</button>
            </div>
            {loading && <p className={"loader"}>Загрузка...</p>}
            {error && <p className={"error"}>{error}</p>}
            {!loading && games.length === 0 && (
                <p className={"no-games"}>Нет игр для отображения</p>)}

            <div className={"games-grid"}>
                {currentGames.map((game) => {
                    const videoSrc = [`/g/${game.id}/videoplayback.webm`, `/g/${game.id}/videoplayback.mp4`];
                    return (
                        <div className={"game-card"}
                             key={game.id}
                             onMouseEnter={() => setHoverVideo(game.id)}
                             onMouseLeave={() => setHoverVideo(null)}>
                            {hoverVideo === game.id ? (
                                <video autoPlay muted loop playsInline>
                                    <source src={videoSrc[0]} type="video/webm"/>
                                    <source src={videoSrc[1]} type="video/mp4"/>
                                </video>
                            ) : (
                                <img src={game.thumbnail} alt={game.title} loading="lazy"/>
                            )}
                            <a type="button" className="game-link-button" href={game.game_url} target="blank">
                                <h3>{game.title}</h3></a>
                            <p>{game.short_description}</p>
                            <p><b>Платформа:</b> {game.platform}</p>
                        </div>)
                })}
            </div>
        </div>
    );
}

export default App;