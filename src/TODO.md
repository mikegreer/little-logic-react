##TODO:

* Reduce data stored in grid file
{"id":231,"type":0,"rules":[],"selected":false,"column":7,"row":14,"gridX":207.84609690826528,"gridY":348}

  * could calculate row and col from id:
    const column = i % cols;
    const row = Math.floor(i / cols);

  * could calc grid x and grid y:
    const gridX = row % 2 ? column * cellWidth : column * cellWidth + (cellWidth / 2);
    const gridY = row * cellHeight + cellHeight / 2;

  * move selected into a state param:
    selected: 231,

    Target: {"id":231,"type":0,"rules":[]}

2. move rules to different context and map with ID?
Prevent the grid itself from re-rendering when rules are updated

Target: {"id":231,"type":0,"rules":[3,5,51]}



"rules":[{"releaseFrequency":1,"points":5,"color":0,"direction":1,"visualDirection":90,"audioSample":0,"audioCtx":0}]


