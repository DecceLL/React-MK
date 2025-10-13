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
    const gamesPerPage = 12;
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



    const Pagination = ({ currentPage, totalPages, onPageChange}) => {
        if (totalPages <= 1)
            return null;
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
    const lastGameIndex = currentPage * gamesPerPage
    const firstGameIndex = lastGameIndex - gamesPerPage
    const currentGames = games.slice(firstGameIndex, lastGameIndex)
    const totalPages = Math.ceil(games.length / gamesPerPage)

    return (
        <div className="mainStyle">
            <h1 className="charge-name">Список игр</h1>
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >
                <PlatformFilter value={platform} onChange={setPlatform} />
                <CategoryFilter value={category} onChange={setCategory} />
                <SortFilter value={sort} onChange={setSort} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                <button className={"reset-button"} onClick={resetFilters}>Сбросить фильтры</button>

            </div>

            {loading && <p style={{ textAlign: "center" }}>Загрузка...</p>}
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            {!loading && games.length === 0 && (
                <p style={{ textAlign: "center" }}>Нет игр для отображения</p>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "15px",
                }}
            >
                {!loading &&
                    !error &&
                    currentGames.map((game) => (
                        <div
                            key={game.id}
                    style={{
                    background: "#ccc",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
                    >
                    <img
                    src={game.thumbnail}
                    alt={game.title}
                    style={{ width: "100%", borderRadius: "4px" }}
                    />
                    <h3>{game.title}</h3>
            <p style={{ fontSize: "14px", color: "#524d4d" }}>
                {game.short_description}
            </p>
            <p style={{ marginTop: "auto", marginBottom: 0 }}>
                <b>Платформа:</b> {game.platform}
            </p>
        </div>
))}
</div>
</div>
);
}

export default App;