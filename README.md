# FV Ball Knowers Scoreboard

A live scoreboard for my friends' daily [GeoSports](https://geosports.app) games. GeoSports only shows a week of daily scores, so I keep every result in a Google Sheet. This page turns the sheet into leaderboards, records, form charts and head-to-head scouting reports. Update the sheet, reload the page, and the numbers change.

**▶ Live: [maximhoeft94.github.io/geosports-dashboard](https://maximhoeft94.github.io/geosports-dashboard/)**

![Overview](screenshots/overview.png)

## What it does

**Overview tab**
- Record Book: best all-time average, highest round, most days won, longest streak, most rounds played
- Highlight Reel & Bloopers: biggest blowout, photo finish, hot hand, ice cold, wildest swing, players who skipped the week
- Season totals for the whole group
- Leaderboard for today, this week, this month and all-time, ranked by average like GeoSports does, with a 7-day trend line per player
- Daily scores chart with player and date-range filters, days-won and current-form charts, and a full daily results table

**Player Analysis tab**
- Stat cards for any player: all-time average, rounds, days won, win rate, streak, this week vs. all-time, best and worst rounds
- Scouting report: rank gaps, recent form, win rate vs. the group, consistency, best day of the week, nemesis and favorite matchup
- Score trend with a 5-round rolling average and the group's daily average
- Head-to-head record against every other player on days both played
- Score distribution

![Player analysis](screenshots/player.png)

## How it works

```
GeoSports group ──(refresh)──▶ Google Sheet ──(CSV)──▶ index.html (Chart.js)
```

- **Data:** a view-only Google Sheet with four tabs. `Daily Scores` has one row per day and one column per player. `Players` has each member's standings for today, this week, this month and all-time. `Info` holds the group name and when the data was last refreshed. `Data Sources` records where each table came from.
- **Refreshing:** GeoSports shows every member's daily scores for the last 7 days. Each refresh adds new days to the sheet and updates the last 7, so late plays get picked up and older days are never overwritten. As long as a refresh happens at least once a week, no day is lost.
- **Page:** a single static `index.html` on GitHub Pages. It fetches each tab's CSV export straight from the browser and computes everything client-side, so there's no backend.
- **Accuracy rules:** group records only use days with everyone's scores. Blowouts and photo finishes wait until a day is over. Hot hand and ice cold need at least 3 rounds in the last week.

**Stack:** JavaScript · Chart.js · HTML/CSS · Google Sheets · GitHub Pages

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

To point it at a different sheet, change `SHEET_ID` in `index.html`. The sheet needs the `Daily Scores`, `Players` and `Info` tabs described above and must be shared as "Anyone with the link can view".

![Mobile](screenshots/mobile.png)

---
Built by Maxim Hoeft.
