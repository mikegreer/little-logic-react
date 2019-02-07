# TODO

## Working
* simple goal rules:
  * number
    * number decreases when correct color hits
      * saved at LLOutput level
  * color
  * samples
    * when all goals are 0, level is complete
* pause / play / restart icons

## UI
* UI for pulses
* toolbar icons
* emitter, router, goal icons rendered on grid
___
* hover over hex in create mode should show ghost of asset to be created
* show cell moving while dragging
* change mouse cursor for toolbox modes
  * select: cursor
  * move: arrow cross
  * create: small cross / plus
  * hole: drill?
  * clear:  
* sound on / off UI and controls
* UI for save / load
### UI refactor
* clear / delete cell UI shows up when selected (instead of 'clear' tool in toolbox)
* touch events for select vs drag (instead of 'move' in toolbox)
* mobile UI collapsing the two views and scaling within each

## features
* puzzles: define and check win state with goals
  * lockable emitters / routers / goals - only some rules / params editable
* sound pack options panel:
  * switch between sample packs
  * save sample pack selection to level settings
* auto cell size to fit available space given rows / columns
* make colours represent instruments / voice
  * sample selection (1 - 6) within each color.
___
* settings menu: columns, rows, tempo
* per cell mute button
* highlight the currently loaded save slot. Remove highlight when rule or cell changes are made.
* keyboard shortcut for rule number - num keys map to rule (if it has that many rules)

## consider
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
* per color voice ideas
  * kick, hat, pulse, snare
  * strings, brass, percussion, woodwind
  * animals: farm, jungle, 

## Bugs
* play / pause label doesn't update
* When deleting save files, rules are not removed from the rules array
  * Current rule indexing references position. Removing will break all saves.
* If I delete all saves and refresh, a new blank '0' save does not appear.
* When restarting after pausing, timestamp is out of sync. Pause / restart from current beat.

## done
* ~keyboard support:~
  * ~change tool: (s)elect, (m)ove, (e)mitter, (r)outer, (g)oal~
  * jump to rule #, ~arrows~
  * ~(p)lay / (p)ause, (c)lear~