$(document).ready(function() {
    console.log("Document is ready");

    const BASE_URL = "https://www.anilibria.tv";
    let isLoading = false;
    let currentIndex = 0;

    function fetchRandomTitles(count) {
        if (isLoading) return;
        isLoading = true;
        console.log("Fetching random titles");
        
        for (let i = 0; i < count; i++) {
            $.get('/api/random-title', function(data) {
                if (data.error) {
                    console.error("API Error:", data.error);
                    isLoading = false;
                    return;
                }

                let titleRu = data.names.ru || "Unknown Title";
                let titleEn = data.names.en || "Unknown Title";
                let year = data.season && data.season.year ? data.season.year : "Unknown Year";
                let genres = data.genres ? data.genres.join(", ") : "Unknown Genres";
                let episodes = data.player && data.player.series && data.player.series.string ? data.player.series.string : "Unknown Episodes";
                let description = data.description || "No description available";
                let posterUrl = data.posters && data.posters.original && data.posters.original.url 
                                ? BASE_URL + data.posters.original.url 
                                : "";

                let html = `
                    <div class="title-block">
                        <div class="title-header">
                            ${posterUrl ? `<img src="${posterUrl}" alt="${titleRu}">` : ""}
                            <div class="title-info">
                                <h2>${titleRu}</h2>
                                <p>${titleEn}</p>
                                <p><strong>Year:</strong> ${year}</p>
                                <p><strong>Genres:</strong> ${genres}</p>
                                <p><strong>Episodes:</strong> ${episodes}</p>
                            </div>
                        </div>
                        <div class="title-description">
                            <p>${description}</p>
                        </div>
                    </div>
                `;
                $('#content').append(html);
            }).fail(function(error) {
                console.error("Error fetching random title:", error);
                isLoading = false;
            }).always(function() {
                isLoading = false;
            });
        }
    }

    fetchRandomTitles(5); // Load initial titles

    $(window).on('scroll', function() {
        let blocks = $('.title-block');
        let scrollTop = $(window).scrollTop();
        let windowHeight = $(window).height();
        
        blocks.each(function(index) {
            if ($(this).offset().top <= scrollTop + windowHeight / 2 && $(this).offset().top + $(this).height() > scrollTop + windowHeight / 2) {
                if (index !== currentIndex) {
                    currentIndex = index;
                    console.log("Switched to title " + currentIndex);
                    if (index >= blocks.length - 3) { // Load more titles if near end
                        fetchRandomTitles(5);
                    }
                }
            }
        });
    });
});
