const segment_csv =
`strava_id,zi_link,segment_name,world_id,length,ele_gain,grade,type,climb_cat
24682578,ventoux-kom,Ventoux KOM,10,19,1481,7.8,kom,HC
17267489,alpe-du-zwift,Alpe du Zwift KOM,1,12.2,1036,8.5,kom,HC
16784833,epic-kom,Epic KOM,1,9.5,415.7,3.9,kom,2
16784850,epic-kom-reverse,Epic KOM Reverse,1,6.3,402.6,5.9,kom,2
18397965,innsbruck-kom,Innsbruck KOM,5,7.4,399.9,5.4,kom,2
18397927,innsbruck-kom-reverse,Innsbruck KOM Reverse,5,5.8,396.8,6.9,kom,2
16781407,keith-hill-kom,Keith Hill KOM,3,4.3,225.2,5,kom,3
12744502,box-hill-kom,Box Hill KOM,3,3,134.7,4.4,kom,4
16781411,leith-hill-kom,Leith Hill KOM,3,1.9,132.6,7,kom,4
14270131,volcano-kom,Volcano KOM,1,3.8,128.6,3.2,kom,4
16802545,fox-hill-kom,Fox Hill KOM,3,2.4,120.7,4.3,kom,4
24690967,petit-kom,Petit KOM,10,2.7,105.2,3.9,kom,4
28432259,temple-kom,Temple KOM,9,2.5,99.4,3.6,kom,4
19141092,new-york-kom-reverse,New York KOM Reverse,4,1.1,89,8.1,kom,4
19141090,new-york-kom,New York KOM,4,1.4,88.7,6.3,kom,4
28432293,temple-kom-reverse,Temple KOM Reverse,9,1.9,68,3.5,kom,NC
28433453,castle-kom,Castle KOM,9,2.5,66.4,2.1,kom,NC
21747822,yorkshire-kom,Yorkshire KOM,7,1.2,65.8,5.5,kom,NC
21343975,titans-grove-kom,Titans Grove KOM,1,2.6,59.4,2.2,kom,NC
33636401,sgurr-summit-north,Sgurr Summit North,13,1.6,59,3.7,kom,NC
12128029,hilly-kom-reverse,Hilly KOM Reverse,1,2.4,55.8,2,kom,NC
30407861,rooftop-kom,Rooftop KOM,9,1.9,53.6,2.7,kom,NC
12109030,hilly-kom,Hilly KOM,1,0.9,50.9,5.5,kom,NC
21747891,yorkshire-kom-reverse,Yorkshire KOM Reverse,7,1.2,47.9,4,kom,NC
21343961,titans-grove-kom-reverse,Titans Grove KOM Reverse,1,0.89,39,4.4,kom,NC
12128826,libby-hill-kom,Libby Hill,2,0.64,38.1,6,kom,NC
22813206,23rd-st-kom-reverse,23rd St KOM Reverse,2,1.1,38.1,3.5,kom,NC
33636430,sgurr-summit-south,Sgurr Summit South,13,1,34,3.3,kom,NC
25718000,leg-snapper-kom,Leg Snapper KOM,5,0.43,29.6,6.9,kom,NC
26935782,libby-hill-kom-reverse,Libby Hill KOM Reverse,2,0.7,26.2,3.6,kom,NC
12128917,23rd-st-kom,23rd St. KOM,2,0.26,24.1,9.3,kom,NC
33620168,breakaway-brae,Breakaway Brae,13,0.62,14.6,2.4,kom,NC
33636632,the-clyde-kicker-reverse,The Clyde Kicker Reverse,13,0.6,12,0.7,kom,NC
0,the-clyde-kicker,The Clyde Kicker,13,0.3,10.7,3.6,kom,NC
24701010,aqueduc-kom-reverse,Aqueduc KOM Reverse,10,0.4,9.4,2.3,kom,NC
1,breakaway-brae-reverse,Breakaway Brae Reverse,13,0.4,8.5,2,kom,NC
24700976,aqueduc-kom,Aqueduc KOM,10,0.42,4.9,0.9,kom,NC
14120182,,Radio Tower Climb,1,1.1,149.7,13.7,kom,4
2,acropolis-sprint,Acropolis Sprint,1,0.45,,0.67,sprint,S
3,acropolis-sprint-reverse,Acropolis Sprint Reverse,1,0.45,,-1.10,sprint,S
4,alley-sprint,Alley Sprint,9,0.48,,0,sprint,S
5,alley-sprint-reverse,Alley Sprint Reverse,9,0.38,,-1.20,sprint,S
6,ballon-sprint,Ballon Sprint,10,0.21,,0,sprint,S
7,ballon-sprint-reverse,Ballon Sprint Reverse,10,0.32,,0,sprint,S
8,bell-lap-prime,Bell Lap Prime Sprint,8,0.29,,0.60,sprint,S
9,boardwalk-sprint,Boardwalk Sprint,9,0.24,,0,sprint,S
10,boardwalk-sprint-reverse,Boardwalk Sprint Reverse,9,0.31,,0,sprint,S
11,broad-st-sprint,Broad St. Sprint,2,0.28,,-0.10,sprint,S
12,broad-st-sprint-reverse,Broad St. Sprint Reverse,2,0.06,,0,sprint,S
13,castle-park-sprint,Castle Park Sprint,9,0.22,,-0.70,sprint,S
14,castle-park-sprint-reverse,Castle Park Sprint Reverse,9,0.21,,0.30,sprint,S
15,champions-sprint,Champion's Sprint,13,0.2,,-0.40,sprint,S
16,champs-elysees-sprint,Champs-Élysées Sprint,11,0.15,,3.50,sprint,S
17,country-sprint,Country Sprint,9,0.13,,0,sprint,S
18,country-sprint-reverse,Country Sprint Reverse,9,0.15,,0,sprint,S
19,downtown-dolphin-prime,Downtown Dolphin Prime Sprint,8,0.2,,2,sprint,S
20350066,fuego-flats-reverse,Fuego Flats Reverse,1,7.1,,0,sprint,S
21,fuego-flats-sprint,Fuego Flats Sprint,1,0.5,,0.20,sprint,S
22,sprint-innsbruck,Innsbruck Sprint,5,0.3,,0.07,sprint,S
23,sprint-reverse-innsbruck,Innsbruck Sprint Reverse,5,0.2,,0,sprint,S
24,jwb-sprint,JWB Sprint,1,0.36,,-0.10,sprint,S
25,jwb-sprint-reverse,JWB Sprint Reverse,1,0.2,,0,sprint,S
26,lutece-express-sprint,Lutece Express Sprint,11,0.22,,-1,sprint,S
27,marina-sprint,Marina Sprint,10,0.34,,0,sprint,S
28,marina-sprint-reverse,Marina Sprint Reverse,10,0.19,,0,sprint,S
29,monument-ave-sprint,Monument Ave Sprint,2,0.22,,-0.40,sprint,S
30,monument-ave-sprint-reverse,Monument Ave Sprint Reverse,2,0.2,,0,sprint,S
31,ny-sprint,NY Sprint,4,0.15,,-4.30,sprint,S
32,ny-sprint-reverse,NY Sprint Reverse,4,0.23,,0,sprint,S
33,pave-sprint,Pavé Sprint,10,0.33,,0,sprint,S
34,pave-sprint-reverse,Pavé Sprint Reverse,10,0.33,,0,sprint,S
35,railway-sprint,Railway Sprint,9,0.64,,-1.10,sprint,S
36,sasquatch-sprint,Sasquatch Sprint,1,0.35,,0.20,sprint,S
37,sasquatch-sprint-reverse,Sasquatch Sprint Reverse,1,0.35,,0.10,sprint,S
38,shisa-sprint,Shisa Sprint,9,0.29,,0.70,sprint,S
39,shisa-sprint-reverse,Shisa Sprint Reverse,9,0.28,,0,sprint,S
40,stoneway-sprint,Stoneway Sprint,1,0.4,,0.75,sprint,S
41,stoneway-sprint-reverse,Stoneway Sprint Reverse,1,0.4,,0.75,sprint,S
42,mall-sprint,The Mall Sprint,3,0.2,,-1.40,sprint,S
43,mall-sprint-reverse,The Mall Sprint Reverse,3,0.2,,1.10,sprint,S
44,tidepool-sprint,Tidepool Sprint,9,0.31,,0,sprint,S
45,tidepool-sprint-reverse,Tidepool Sprint Reverse,9,0.31,,0,sprint,S
46,tower-sprint,Tower Sprint,9,0.32,,0.40,sprint,S
47,tower-sprint-reverse,Tower Sprint Reverse,9,0.32,,0.50,sprint,S
48,village-sprint,Village Sprint,9,0.14,,0,sprint,S
49,village-sprint-reverse,Village Sprint Reverse,9,0.15,,0.80,sprint,S
50,woodland-sprint,Woodland Sprint,1,0.5,,-2,sprint,S
51,woodland-sprint-reverse,Woodland Sprint Reverse,1,0.5,,-1.60,sprint,S
52,yorkshire-sprint,Yorkshire Sprint,7,0.25,,0.80,sprint,S
53,yorkshire-sprint-reverse,Yorkshire Sprint Reverse,7,0.4,,2.40,sprint,S`

module.exports = segment_csv