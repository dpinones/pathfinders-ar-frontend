import {useEffect, useState} from 'react';
import Node from './Node/Node';
import { useStarknetCall} from "@starknet-react/core";
import { useFormContract } from "../../hooks/useFormContract";

import './PathfindingVisualizer.css';

export default function PathfindingOutputVisualizer({pathFindingInput, setPathFindingInput, props}) {

  const { contract: test } = useFormContract();

  const { data: pathFinderResult } = useStarknetCall({
    contract: test,
    method: "path_finder",
    args: pathFindingInput,
    options: { watch: false },
  });

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading && pathFinderResult) {
      console.log(pathFinderResult[0])
      const parsedResult = pathFinderResult[0].map(element => {
          return {
            row: element.x.toString(),
            col: element.y.toString(),
          }
        })
      
      animateShortestPath(parsedResult)
      setLoading(false)
    }

  }, [pathFinderResult, loading]);


  const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          // dibuja el camino 
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      // setTimeout(() => {
      //   const node = visitedNodesInOrder[i];
      //   const nodeClassName = document.getElementById(
      //     `node-${node.row}-${node.col}`,
      //   ).className;
      //   if (
      //     nodeClassName !== 'node node-start' &&
      //     nodeClassName !== 'node node-finish'
      //   ) {
      //     document.getElementById(`node-${node.row}-${node.col}`).className =
      //       'node node-visited';
      //   }
      // }, 10 * i);
    }
  }

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      // if (nodesInShortestPathOrder[i] === 'end') {
      //   setTimeout(() => {
      //     toggleIsRunning();
      //   }, i * 50);
      // } else {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName !== 'node node-start' &&
          nodeClassName !== 'node node-finish'
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
      }, i * 40);
    }
  }

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
    if (!props.isRunning) {
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
          const newGrid = getNewGridWithWallToggled(props.grid, props.row, props.col);
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

  const restart = () => {
    setPathFindingInput(null)
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
        className="btn btn-warning"
        onClick={() => restart()}>
        Restart
      </button>
    </div>
  );
}