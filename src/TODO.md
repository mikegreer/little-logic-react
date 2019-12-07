# TODO

## May fork
* UI to show what goals need.
* UI to show when a goal has been fulfilled
* mode difference: level designer vs level player: designer broadly as is. Player can place a router (limited number available?), or change their rules.
* if goal receives the wrong color, reset the goal objectives (+ play sound)?

* level select modal: grid of puzzles, ticks to show which are complete.
* use 'examples' file structure as levels.
* level complete state: play sound, show level select modal to tick off the current level and let user select next.
* create 10 levels: 
    * route a single color to get to the goal
    * route a two colors to go to different goals
    * use two routers to go to different goals (holes prevent same being used for both)
    * place routers to solve maze
    * two emitters
* levels only place routers. Emitters and goals are in place.
* early levels have routers pre placed, and users need to change their direction
* later levels allow users to place and code routers to reach goals.
* delete rule UI

* play sound when changing direction in rule
* arrow keys move between routers?

#May fork done
* goals keep absorbing pulses after they've completed the number
* Associate sounds to direction arrows (users define direction, not sound).
* make multiple rules much clearer: use language structure to simplify.
* Add 'new rule' button to bottom of text rules (adding another section beneath, not paging)
* style rules to look like typed code (but simpler, with drop downs).
* Make clickable elements of texct rules clearer.
* Add language back into rules: if *red* push *direction-arrow*

## Ready
* propery associate soundPackId to pack it represents
* save sample pack selection to level settings / reload on load
* pause / play / restart icons
* handle puzzle win state
* logic to handle playing back puzzles / progressing / etc
* store goal target rule and restore it when the level is restarted.
* remove goals
* sound effect for hole
* change mouse cursor for toolbox modes
  * select: cursor
  * move: arrow cross
  * create: small cross / plus
  * hole: drill?
  * clear:  
* hide delete / download in saves menu - squares inline to load all the save files.

## UI
* UI for pulses
* toolbar icons
* emitter, router, goal icons rendered on grid
___
* show cell moving while dragging
* hover over hex in create mode should show ghost of asset to be created
* sound on / off UI and controls
* UI for save / load
* clear grid should be held for 2 seconds before it clears: button fills up to show time.
### UI refactor
* clear / delete cell UI shows up when selected (instead of 'clear' tool in toolbox)
* touch events for select vs drag (instead of 'move' in toolbox)
* mobile UI collapsing the two views and scaling within each

## features
* puzzles: define and check win state with goals
  * lockable emitters / routers / goals - only some rules / params editable
* make colours represent instruments / voice
  * sample selection (1 - 6) within each color.
___
* add tempo to settings menu
* per cell mute button
* highlight the currently loaded save slot. Remove highlight when rule or cell changes are made.
* keyboard shortcut for rule number - num keys map to rule (if it has that many rules)

## consider
* game mode: goals and gaps appear as you go. Fulfill a goal to proceed (more goals added).
  * goals as persistent (need red dots, but no specified number), need to keep all satisfied to get another.
  * emitters / routers limited resource until more goals are met, forcing creative use of existing assets to cover multiple goals (use router model for goals here - redirects pulse on hit, doesn't absorb it).
  * could simplify by removing multi-rule per cell
* add evolving logic to routers:
  * counter
    * (a rule level variable)
  * if counter [ < / > / = ] [int]
    * if color matches
      * route direction
      * sample
      * [ add / remove / reset ] counter
* Prevent whole app rerendering on rule change
  * Better state management generally
  * Redux
* change goal to target (shortcuts e/r/t consecutive on keyboard)

## Bugs
* ensure pulses are removed as soon as they leave cells
* When deleting cell, rules are not removed from the rules array
  * Current rule indexing references position. Removing will break all saves.
  * Change rules to key value pair object (map?)
* When restarting after pausing, timestamp is out of sync. Pause / restart from current beat.

## done
* ~keyboard support:~
  * ~change tool: (s)elect, (m)ove, (e)mitter, (r)outer, (g)oal~
  * jump to rule #, ~arrows~
  * ~(p)lay / (p)ause, (c)lear~
* simple goal rules:
  * number
    * number decreases when correct color hits
      * saved at LLOutput level
  * color
  * samples
    * when all goals are 0, level is complete
* sliders to resize hex grid
* update existing cells when grid is resized
* file system / code structure for loading in puzzles
* auto cell size to fit available space given rows / columns
* settings menu: columns, rows
* save cut off cells when grid is resized and restore them if enlarged
* play / pause label doesn't update
* clear array of cut off cells when a new level / save is loaded
* remove blank 0 from saves, and add a button to create a blank creation.
* If I delete all saves and refresh, a new blank '0' save does not appear.
* per color voice ideas
  * kick, hat, pulse, snare
  * strings, brass, percussion, woodwind
  * animals: farm, jungle, 
* sound pack options panel:
  * switch between sample packs
* LLOutput render being called repeatedly
* pause / play doesn't work when a goal is present (even if goals deleted)
* randomise properties of new emitters
* prevent overwriting cells with add tools
* hold to delete save file + prompt when clicking
* style sliders (settingsEditor.js)