<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Zwift Route Tracker </h3>

  <p align="center">
    This app is designed to track your times and attempts of Zwift routes, KOM segments, and Climb Portals.  Strava is used to get the times.
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs » EDIT</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo EDIT</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#getTokens">Getting Your Tokens</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li>
    <a href="#backend">Backend - Express JS</a>
    <ul>
      <li><a href="#models">Models</a></li>
      <li><a href="#routes">Routes</a></li>
      <li><a href="#functions">Functions</a></li>
    </ul>
    </li>
    <li>
      <a href="#frontend">Frontend - Vite React</a>
      <ul>
        <li><a href="#routes">Routes</a></li>
      </ul>
      </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
     <li><a href="#footnotes">Footnotes</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
# About The Project
Designed to track Zwift routes and segments using data from Zwift Insider and Strava to track all-time PRs and yearly Prs for Routes, KOM segments, and Climb Portal Segments found in Zwift.  Sprint and some shorter KOM segments are not tracked due to Strava Segment distance requirements

This app is powered by Zwift*, Strava*, Zwift Insider*, and ZwiftHub*.  

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With
[![ExpressJs][ExpressJS]][ExpressJS-url]
[![Sequelize][Sequelize]][Sequelize-url]
[![PostgreSQL][PostgreSQL]][PostgreSQL-url]
[![React][React.js]][React-url]
[![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
# Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

## Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

## Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
# Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
# Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
# Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Backend -->
# Backend - ExpressJS
The backend is built on a ExpressJS framework built with 7 distinct folders

| Folder | Description |
| ----------- | ----------- |
| config | Connection infornation for Sequilize |
| controllers | Houses the routes |
| functions | Houses functions used by multple scripts |
| migrations | Houses Sequilize DB mirgrations |
| models | Houses the projects models |
| seeders | csv and scripts seed the database utlizing Sequilize |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Models -->
## Models

### Routes
This table houses the built in routes built into Zwift, most Event-Only Routes have been omitted.

| Key | pk | type | description |
| ----------- | ----------- | ----------- | ----------- |
| id | TRUE | int | Primary id for row, only used for sequilize processes |
| route_id | TRUE | int | id of the route, used to get data from ZwiftHub |
| name | FALSE | str | name of the route |
| zi_link | FALSE | str | id used to link to the Zwift Insider details page |
| world_id | FALSE | int | Zwift world the route cam be found.  Use transation table |
world_route_id | FALSE | int | Id for the route within the discint world |
| Strava _id | FALSE | int | id for the route on Strava |
| length | FALSE | num | length (km) of the route |
| elevation | FALSE | int | total elevation gained (m) for the route |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Segments
  * This table houses the built in KOM segments built into Zwift

| Key | pk | type | description |
| ----------- | ----------- | ----------- | ----------- |
| id | TRUE | int | Primary id for row, only used for sequilize processes |
| Strava_id | TRUE | int | id for the route on Strava |
| zi_link | FALSE | str | id used to link to the Zwift Insider details page |
| segment_name | FALSE | string | Zwift name for the segment |
| world_id | FALSE | int | Zwift world the segment cam be found.  Use transation table |
| length | FALSE | num | length (km) of the segment |
| grade | FALSE | int | average grade  for the segment |
| length | FALSE | num | length (km) of the segment |
| type | FALSE | str  | Whether Zwift Catagories it as a Sprint or KOM |
| climb_cat | FALSE | str | Calculated Catagory of the Climb |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Climb_Portal

This table houes the climb portal segments in Zwift. This includes segments for Watopia and France Worlds, as well as, the real world segment

| Key | pk | type | description |
| ----------- | ----------- | ----------- | ----------- |
| id | TRUE | int | Primary id for row, only used for sequilize processes |
| Strava_id | TRUE | int | id for the route onStrava for the Watopia Segment |
| fr_Strava_id | FALSE | int | id for the route onStrava for the France Segment |
| rw_Strava_id | TRUE | int | id for the route onStrava for the  Real World Segment |
| zi_link | FALSE | str | id used to link to the Zwift Insider details page |
| segment_name | FALSE | string | Zwift name for the segment |
| world_id | FALSE | int | Zwift world the segment cam be found.  Use transation table |
| length | FALSE | num | length (km) of the segment |
| grade | FALSE | int | average grade  for the segment |
| length | FALSE | num | length (km) of the segment |
| type | FALSE | str  | Whether Zwift Catagories it as a Sprint or KOM |
| climb_cat | FALSE | string | Calculated Catagory of the Climb |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Zwift_Prs

This table houses the top 3 times for each tracked segment from the routes, climb_portal, and segments tables

| Key | pk | type | description |
| ----------- | ----------- | ----------- | ----------- |
| id | TRUE | int | Primary id for row, only used for sequilize processes |
| Strava_id | TRUE | int | id for the route on Strava |
| type | FALSE |  Str | table the segment can be found |
| count | FALSE | int | number of times segment has been attempted |
| pr_time | FALSE | int | number of seconds in your fastest effort |
| pr_date | FALSE | str | date of your fastest effort |
| pr_effort_id | FALSE | bigint | strava id of your best effort|
| silver_time | FALSE | int | number of seconds in your second fastest effort |
| silver_date | FALSE | str | date of your second fastest effort |
| silver_effort_id | FALSE | bigint | strava id of your second best effort|
| bronze_time | FALSE | int | number of seconds in your third fastest effort |
| bronze_date | FALSE | str | date of your third fastest effort |
| bronze_effort_id | FALSE | bigint | strava id of your third best effort|

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Yearly_PRs

This table houses the best time from year of each tracked segment from the routes, climb_portal, and segments tables

| Key | pk | type | description |
| ----------- | ----------- | ----------- | ----------- |
| id | TRUE | int | Primary id for row, only used for sequilize processes |
| Strava_id | TRUE | int | id for the route on Strava |
| year | FALSE | int | year of the best effort |
| pr_time | FALSE | int | number of seconds in your fastest effort |
| pr_date | FALSE | str | date of your fastest effort |
| pr_effort_id | FALSE | bigint | strava id of your best effort|

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### World Translation Table

| id | world |
| ----------- | ----------- | 
| 1 | Watopia |
| 2 | Richmond |
| 3 | London |
| 4 | New York |
| 5 | Innsbruck |
| 6 | Bologna |
| 7 | Yorkshire |
| 8 | Crit City |
| 9 | Makuri Islands |
| 10 | France |
| 11 | Paris |
| 12 | Gravel Mountain |
| 13 | Scotland |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- routes -->
## Routes

### seed_prs

This route has processes to update data in batch
These endpoints can only accessed on the backend

| endpoint | method | Process Name | 
| ----------- | ----------- | ----------- |
| '/' | POST | Seed Date |
| '/date_clean | PUT | Clean Date |

**Seed Date**

Process gets all past data, from Strava and updates the Zwift_PR and Yearly_PR table

1. Use the refresh token to get a valid access token from Strava
2. Get all the Strava Activities and build a list of activities with the type of 'VirtualRide'
3. Get and process data from Strava for each activity.  Update the tables where appropriate
4. Update Segment Effort Counts

Strava API call rates are 100 calls every 15 minutes and 1000 calls daily
Process pauses 15 seconds every API call to keep call rates to ~ 60 per 15 minutes

**Clean Date**

Cleans the date on both PR tables.  The format is YYYY-MON-DD, date from Strava comes in as YYYY-MM-DD, this process fixes any of the translations that were missed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### portal

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### segments

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### routes

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- functions -->


<!-- Frontend -->
<!-- routes -->



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Footnotes
 \* - This application is independent and not associtated with any other app

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- https://github.com/othneildrew/Best-README-Template/blob/master/README.md#usage
https://www.markdownguide.org/cheat-sheet/ -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- Contributors Shield -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors

<!-- Forks Shield -->
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members

<!-- Stars Shield -->
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers

<!-- Issues Shield -->
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues

<!-- License Shield -->
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt

<!-- Linkedin Shield -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username

<!-- Express Shield -->
[ExpressJs]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[ExpressJs-url]: https://expressjs.com/

<!-- Postgres Shield -->
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/

<!-- Sequilize Shield -->
[Sequelize]: https://img.shields.io/badge/sequelize-323330?style=for-the-badge&logo=sequelize&logoColor=blue
[Sequelize-url]: https://sequelize.org/
<!-- React Shield -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

<!-- Bootstrap Shield -->
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
