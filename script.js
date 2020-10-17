document.getElementById("animeSubmit").addEventListener("click", function(event) {
  event.preventDefault();
  const value = document.getElementById("animeInput").value;
  if (value === "")
    return;
  const url = "https://api.jikan.moe/v3/search/anime?q=" + value;
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {

      let results = "";

      for (let i = 0; i < json.results.length; i++) {

        let result = json.results[i];

        //For the sake of a BYU assignment, explicit results are filtered
        if (result.rated == "Rx" || result.rated == "R+") {
          continue;
        }

        //User specified Rating limit
        let maxRating = document.getElementById("maxRating").value;
        if (maxRating == "G") {
          if (result.rated == "PG" || result.rated == "PG-13" || result.rated == "R") {
            continue;
          }
        } else if (maxRating == "PG") {
          if (result.rated == "PG-13" || result.rated == "R") {
            continue;
          }
        } else if (maxRating == "PG-13") {
          if (result.rated == "R") {
            continue;
          }
        }

        results += "<div class='animeResult'>";

        //Media type and Title
        results += "<h2>" + "(" + result.type + ") " + result.title + "</h2>";

        results += "<div class='horizontal'>";

        //Thumbnail
        results += "<img src='" + result.image_url + "'>";
        results += "<div>"

        //Start Date, called Release date if Movie or OVA
        if (result.type == "Movie" || result.type == "OVA") {
          results += "<p>" + "Release Date: ";
        } else if (moment() > moment(result.start_date)) {
          results += "<p>" + "Started airing ";
        } else {
          results += "<p>" + "Will start airing on ";
        }
        if (result.start_date != null) {
          results += moment(result.start_date).format('MMMM Do YYYY') + "</p>";
        } else {
          results += "undetermined date";
        }

        //End Date, only shown if show has ended, doesn't show for Movies or OVAs
        if (result.end_date != null && result.type != "Movie" && result.type != "OVA") {
          results += "<p>" + "Finished airing " + moment(result.end_date).format('MMMM Do YYYY') + "</p>";
        }

        //Content Rating
        results += "<p>" + "Rated " + result.rated + "</p>";

        //User Score, display only if show has started airing
        if (moment() > moment(result.start_date)) {
          results += "<p>" + "Score: " + result.score + "</p>";
        }

        //Episode number, display only if show has started airing, don't display anything if media type is Movie or OVA
        if (result.type != "Movie" && result.type != "OVA" && moment() > moment(result.start_date)) {
          results += "<p>" + result.episodes + " episodes" + "</p>";
        }

        results += "</div>";

        results += "</div>";

        //Synopsis, API returns truncated version, contains link to MyAnimeList page.
        results += "<p>" + result.synopsis + " <a href ='" + result.url + "'>read more</a>" + "</p>";
        results += "</div>";
      }
      document.getElementById("animeResults").innerHTML = results;
    })
});
