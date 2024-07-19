const nodemailer = require("nodemailer");
const { fetchMovieDetails } = require("./fetchMovies");
const { EMAIL, EMAIL_PASSWORD } = require("./constants");

const sendEmailNotification = async (movie, previousReleaseDate) => {
  console.log(`Preparing email for movie: ${movie.title}`);
  const movieDetails = await fetchMovieDetails(movie.id);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject: `${movie.title} : Release Date Updated`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="display: flex; align-items: flex-start;">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    } Poster" style="width: 200px; height: auto; margin-right: 20px;">
          <div>
            <h2>${movie.title}</h2>
            <p><strong>Previous Release Date:</strong> ${previousReleaseDate}</p>
            <p><strong>Updated Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <p><strong>Cast:</strong> ${movieDetails.credits.cast
              .slice(0, 5)
              .map((actor) => actor.name)
              .join(", ")}</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully for movie:", movie.title);
  } catch (error) {
    console.error("Error sending email for movie:", movie.title, error);
  }
};

module.exports = sendEmailNotification;
