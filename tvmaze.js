"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const missingIMG = 'https://tinyurl.com/25wb5t9u';
const $episodesList = $("#episodesList");



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  let res = await axios.get("https://api.tvmaze.com/search/shows", {params: {q: term}});

  return res.data.map(val => {
    const valShow = val.show;
    return {
      id: valShow.id,
      name: valShow.name,
      summary: valShow.summary,
      image: valShow.image ? valShow.image.medium : missingIMG,
    };
  });
};


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  };
};


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  return res.data.map(val => {
    return {
      id: val.id,
      name: val.name,
      season: val.season,
      number: val.number,
    };
  });
};

function populateEpisodes(episodes) {
  $episodesList.empty()

  for(let episode of episodes){
    const list = $(`<li> ${episode.name}(Season: ${episode.season}, Episode: ${episode.number})</li>`);
    $episodesList.append(list);
  };
  $episodesArea.show()
};
/** Given list of episodes, create markup for each and to DOM */
async function getEpisodesToDisplay(event) {
  //The event here is a click on the 'showsList', then we will use .closest('.Show') to determine the closest element with the class of show, and then grab the value of the 'data-show-id' attribute
  const id = $(event.target).closest(".Show").data('show-id');
  const episodes = await getEpisodesOfShow(id);

  populateEpisodes(episodes);
}

$showsList.on('click', '.Show-getEpisodes', getEpisodesToDisplay);




