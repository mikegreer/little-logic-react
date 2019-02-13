# TODO

## Working
* per color voice ideas
  * kick, hat, pulse, snare
  * strings, brass, percussion, woodwind
  * animals: farm, jungle, 
* pause / play / restart icons
* handle puzzle win state
* logic to handle playing back puzzles / progressing / etc
* store goal target rule and restore it when the level is restarted.

## UI
* UI for pulses
* toolbar icons
* emitter, router, goal icons rendered on grid
___
* show cell moving while dragging
* change mouse cursor for toolbox modes
  * select: cursor
  * move: arrow cross
  * create: small cross / plus
  * hole: drill?
  * clear:  
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
* sound pack options panel:
  * switch between sample packs
  * save sample pack selection to level settings

## Bugs
* LLOutput render being called repeatedly
* pause / play doesn't work when a goal is present (even if goals deleted)
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