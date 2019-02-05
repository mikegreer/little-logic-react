##TODO:

* change sound pack
* rules for goals
* Prevent whole app rerendering on rule change
  * Better state management generally
  * Redux

#UI
* UI for pulses
* pause / play / restart icons
* toolbar icons
* emitter, router, goal icons rendered on grid
* sound on / off UI and controls
* UI for save / load
* clear / delete cell UI when selected (instead of 'clear' tool in toolbox)
* touch events for select vs drag 
* mobile UI collapsing the two views and scaling within each

#features
* sound pack options panel:
  * switch between synth and samples
  * assign synth notes / voice to slots
  * switch sample packs and assign to slots.
* hex cell type for gap / impassable cell
* settings menu: columns, rows, cell size (or auto cell size?), tempo
* puzzles: define and check win state
* keyboard support:
  * change tool: (s)elect, (m)ove, (e)mitter, (r)outer, (g)oal
  * jump to rule #, arrows
  * (p)lay / (p)ause, (c)lear
* highlight the currently loaded slot. Remove highlight when rule or cell changes are made.

#consider
* make colours represent instruments / voice
  * kick, hat, pulse, snare
  * strings, brass, percussion, woodwind
  * animals, s
* sample selection within each color.
* goals rules:
- if counter [ < / > / = ] [int]
- on [color]
- [ add / remove / reset ] counter
- play [ note ]

