import React, {useEffect} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

export default function PathfindingVisualizer({setPathFindingInput, props}) {

  useEffect(() => {
    props.setGrid(getInitialGrid());
  }, []);

  const getInitialGrid = (
    rowCount = props.ROW_COUNT,
    colCount = props.COLUMN_COUNT,
  ) => {
    const initialGrid = [];
    for (let row = 0; row < rowCount; row++) {
      const currentRow = [];
      for (let col = 0; col < colCount; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  };

  const toggleIsRunning = () => {
    props.setIsRunning(!props.isRunning);
  }

  const toggleView = () => {
    if (!props.isRunning) {
      clearGrid();
      clearWalls();
      const isDesktopView = !props.isDesktopView;
      let grid;
      if (isDesktopView) {
        grid = getInitialGrid(
          props.ROW_COUNT,
          props.COLUMN_COUNT,
        );
        props.setIsDesktopView(isDesktopView);
        props.setGrid(grid);
      } else {
        if (
          props.START_NODE_ROW > props.MOBILE_ROW_COUNT ||
          props.FINISH_NODE_ROW > props.MOBILE_ROW_COUNT ||
          props.START_NODE_COL > props.MOBILE_COLUMN_COUNT ||
          props.FINISH_NODE_COL > props.MOBILE_COLUMN_COUNT
        ) {
          alert('Start & Finish Nodes Must Be within 10 Rows x 20 Columns');
        } else {
          grid = getInitialGrid(
            props.MOBILE_ROW_COUNT,
            props.MOBILE_COLUMN_COUNT,
          );
          props.setIsDesktopView(isDesktopView);
          props.setGrid(grid);
        }
      }
    }
  }

  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart:
        row === props.START_NODE_ROW && col === props.START_NODE_COL,
      isFinish:
        row === props.FINISH_NODE_ROW &&
        col === props.FINISH_NODE_COL,
      distance: Infinity,
      distanceToFinishNode:
        Math.abs(props.FINISH_NODE_ROW - row) +
        Math.abs(props.FINISH_NODE_COL - col),
      isVisited: false,
      isWall: false,
      previousNode: null,
      isNode: true,
    };
  };

  const handleMouseDown = (row, col) => {
    // console.log('handleMouseDown');
    // console.log('row: ', row);
    // console.log('col: ', col);
    if (!props.isRunning) {
      if (isGridClear()) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          'node node-start'
        ) {
          props.setMouseIsPressed(true);
          props.setStartNode(true);
          props.setCurrRow(row);
          props.setCurrCol(col);
        } else if (
          document.getElementById(`node-${row}-${col}`).className ===
          'node node-finish'
        ) {

          props.setMouseIsPressed(true);
          props.setIsFinishNode(true);
          props.setCurrRow(row);
          props.setCurrCol(col);
        } else {
          console.log('handleMouseDown');
          const newGrid = getNewGridWithWallToggled(props.grid, row, col);
          props.setGrid(newGrid);
          props.setMouseIsPressed(true);
          props.setIsWallNode(true);
          props.setCurrRow(row);
          props.setCurrCol(col);
        }
      } else {
        clearGrid();
      }
    }
  }

  const isGridClear = () => {
    for (const row of props.grid) {
      for (const node of row) {
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName === 'node node-visited' ||
          nodeClassName === 'node node-shortest-path'
        ) {
          return false;
        }
      }
    }
    return true;
  }

  const handleMouseEnter = (row, col) => {
    // console.log('handleMouseEnter');
    // console.log('row: ', row);
    // console.log('col: ', col);
    if (!props.isRunning) {
      console.log('mouseIsPressed: ', props.mouseIsPressed);
      if (props.mouseIsPressed) {
        const nodeClassName = document.getElementById(`node-${row}-${col}`)
          .className;
        if (props.isStartNode) {
          if (nodeClassName !== 'node node-wall') {
            const prevStartNode = props.grid[props.currRow][props.currCol];
            prevStartNode.isStart = false;
            document.getElementById(
              `node-${props.currRow}-${props.currCol}`,
            ).className = 'node';

            props.setCurrRow(row);
            props.setCurrCol(col);

            const currStartNode = props.grid[props.row][props.col];
            currStartNode.isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
              'node node-start';
          }
          props.setSTART_NODE_ROW(row);
          props.setSTART_NODE_COL(col);
        } else if (props.isFinishNode) {
          if (nodeClassName !== 'node node-wall') {
            const prevFinishNode = props.grid[props.currRow][props.currCol];
            prevFinishNode.isFinish = false;
            document.getElementById(
              `node-${props.currRow}-${props.currCol}`,
            ).className = 'node';

            props.setCurrRow(row);
            props.setCurrCol(col);

            const currFinishNode = props.grid[row][col];
            currFinishNode.isFinish = true;
            document.getElementById(`node-${row}-${col}`).className =
              'node node-finish';
          }
          props.setFINISH_NODE_ROW(row);
          props.setFINISH_NODE_COL(col);
        } else if (props.isWallNode) {
          console.log('handleMouseEnter');
          const newGrid = getNewGridWithWallToggled(props.grid, row, col);
          props.setGrid(newGrid);
        }
      }
    }
  }

  const handleMouseUp = (row, col) => {
    if (!props.isRunning) {
      props.setMouseIsPressed(false);
      if (props.isStartNode) {
        const isStartNode = !props.isStartNode;
        props.setStartNode(isStartNode);
        props.setSTART_NODE_ROW(row);
        props.setSTART_NODE_COL(col);
      } else if (props.isFinishNode) {
        const isFinishNode = !props.isFinishNode;
        props.setIsFinishNode(isFinishNode);
        props.setFINISH_NODE_ROW(row);
        props.setFINISH_NODE_COL(col);
      }
      getInitialGrid();
    }
  }

  const handleMouseLeave = () => {
    if (props.isStartNode) {
      props.setStartNode(!props.isStartNode);
      props.setMouseIsPressed(false);
    } else if (props.isFinishNode) {
      props.setIsFinishNode(!props.isFinishNode);
      props.setMouseIsPressed(false);
    } else if (props.isWallNode) {
      props.setIsWallNode(!props.isWallNode);
      props.setMouseIsPressed(false);
      getInitialGrid();
    }
  }

  const clearGrid = () => {
    if (!props.isRunning) {
      const newGrid = props.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (
            nodeClassName !== 'node node-start' &&
            nodeClassName !== 'node node-finish' &&
            nodeClassName !== 'node node-wall'
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(props.FINISH_NODE_ROW - node.row) +
              Math.abs(props.FINISH_NODE_COL - node.col);
          }
          if (nodeClassName === 'node node-finish') {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode = 0;
          }
          if (nodeClassName === 'node node-start') {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(props.FINISH_NODE_ROW - node.row) +
              Math.abs(props.FINISH_NODE_COL - node.col);
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
            node.isNode = true;
          }
        }
      }
    }
  }

  const clearWalls = () => {
    if (!props.isRunning) {
      const newGrid = props.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (nodeClassName === 'node node-wall') {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
            node.isWall = false;
          }
        }
      }
    }
  }

  const visualize = (algo) => {
    if (!props.isRunning) {
      clearGrid();
      toggleIsRunning();
      const startNode = props.grid[props.START_NODE_ROW][props.START_NODE_COL];
      const finishNode = props.grid[props.FINISH_NODE_ROW][props.FINISH_NODE_COL];
      
      // camino a dibujar 
      console.log('convertGridToPoints: ', convertGridToPoints(props.grid));
      console.log(`start node: (${startNode.col}, ${startNode.row})`);
      console.log(`end node: (${finishNode.col}, ${finishNode.row})`);

      const arr = convertGridToPoints(props.grid).map(element => String(element))
      const points = [String(startNode.col), String(startNode.row), String(finishNode.col), String(finishNode.row), arr, String(9), String(9)]

      setPathFindingInput(points);
      // const { data: pathFinder } = useStarknetCall({
      //   contract: '0x2828c45f249ce1e6f8ae9e0a231757296810467246e7a19d9cced99142494a0',
      //   method: "path_finder",
      //   args: [2,3,4,5,0],
      //   options: { watch: false },
      // });
      // args: [startNode.col, startNode.row, finishNode.col, finishNode.row, convertGridToPoints(grid)],
    
      // this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

  
  const convertGridToPoints = (grid) => {
    const initialGrid = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j].isWall) {
          initialGrid.push(1);
        } else {
          initialGrid.push(0);
        }
      }
    }
    return initialGrid;
  }


    /******************** Create Walls ********************/
  const getNewGridWithWallToggled = (grid, row, col) => {
    // mouseDown starts to act strange if I don't make newGrid and work off of grid instead.
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (!node.isStart && !node.isFinish && node.isNode) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  };

  // Backtracks from the finishNode to find the shortest path.
  // Only works when called after the pathfinding methods.
  // function getNodesInShortestPathOrder(finishNode) {
  //   const nodesInShortestPathOrder = [];
  //   let currentNode = finishNode;
  //   while (currentNode !== null) {
  //     nodesInShortestPathOrder.unshift(currentNode);
  //     currentNode = currentNode.previousNode;
  //   }
  //   return nodesInShortestPathOrder;
  // }


  return (
    <div>
      <table
        className="grid-container"
        onMouseLeave={() => handleMouseLeave()}>
        <tbody className="grid">
          {props.grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={props.mouseIsPressed}
                      onMouseDown={(row, col) =>
                        handleMouseDown(row, col)
                      }
                      onMouseEnter={(row, col) =>
                        handleMouseEnter(row, col)
                      }
                      onMouseUp={() => handleMouseUp(row, col)}
                      row={row}></Node>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => clearGrid()}>
        Clear Grid
      </button>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => clearWalls()}>
        Clear Walls
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => visualize('JPS')}>
        JPS
      </button>
    </div>
  );
}