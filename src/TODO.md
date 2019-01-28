##TODO:

* Reduce data stored in grid file

Current tile:
{"id":231,"type":0,"rules":[],"selected":false,"column":7,"row":14,"gridX":207.84609690826528,"gridY":348}

  * **DONE**
    could calculate row and col from id once at run time and store in each cell:
    const column = i % cols;
    const row = Math.floor(i / cols);
    These are used a lot by LLOutput. Can they be recalculated and stores on the output obj? Is this faster?
    Calculated once as an array at top level and passed down to grid / output? (Normalise / prevent rerendering).

  * **DONE?**
    could calc grid x and grid y:
    const gridX = row % 2 ? column * cellWidth : column * cellWidth + (cellWidth / 2);
    const gridY = row * cellHeight + cellHeight / 2;

  * **DONE** 
    move selected into a state param:
    selected: 231,

    Target: {"id":231,"type":0,"rules":[]}

2. move rules to different context and map with ID (normalise)
Prevent the grid itself from re-rendering when rules are updated (only when created. LLOutput will need to update).

3. Save / load rules and cells in level object.

Target:
{"id":231,"type":0,"rulesById":[3,5,51]}
rules: [{"releaseFrequency":1,"points":5,"color":0,"direction":1,"visualDirection":90,"audioSample":0,"audioCtx":0}];

