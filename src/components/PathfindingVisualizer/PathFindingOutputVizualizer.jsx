import React, {useEffect} from 'react';
import Node from './Node/Node';
import { useStarknetCall} from "@starknet-react/core";
import './PathfindingVisualizer.css';

export default function PathFindingOutputVisualizer({pathFindingInput}) {

    const [grid, setGrid] = React.useState([]);
    const [START_NODE_ROW, setSTART_NODE_COL] = React.useState(4);
    const [FINISH_NODE_ROW, setFINISH_NODE_ROW] = React.useState(4);
    const [START_NODE_COL, setSTART_NODE_ROW] = React.useState(1);
    const [FINISH_NODE_COL, setFINISH_NODE_COL] = React.useState(7);
    const [mouseIsPressed, setMouseIsPressed] = React.useState(false);
    const [ROW_COUNT, setROW_COUNT] = React.useState(9);
    const [COLUMN_COUNT, setCOLUMN_COUNT] = React.useState(9);
    const [MOBILE_ROW_COUNT, setMOBILE_ROW_COUNT] = React.useState(9);
    const [MOBILE_COLUMN_COUNT, setMOBILE_COLUMN_COUNT] = React.useState(9);
    const [isRunning, setIsRunning] = React.useState(false);
    const [isStartNode, setStartNode] = React.useState(false);
    const [isFinishNode, setIsFinishNode] = React.useState(false);
    const [isWallNode, setIsWallNode] = React.useState(false);
    const [currRow, setCurrRow] = React.useState(0);
    const [currCol, setCurrCol] = React.useState(0);
    const [isDesktopView, setIsDesktopView] = React.useState(true);

    useEffect(() => {
        setGrid(getInitialGrid());
    }, []);

    const getInitialGrid = (
        rowCount = ROW_COUNT,
        colCount = COLUMN_COUNT,
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
        setIsRunning(!isRunning);
    }

    const toggleView = () => {
        if (!isRunning) {
        clearGrid();
        clearWalls();
        const isDesktopView = !isDesktopView;
        let grid;
        if (isDesktopView) {
            grid = getInitialGrid(
            ROW_COUNT,
            COLUMN_COUNT,
            );
            setIsDesktopView(isDesktopView);
            setGrid(grid);
        } else {
            if (
            START_NODE_ROW > MOBILE_ROW_COUNT ||
            FINISH_NODE_ROW > MOBILE_ROW_COUNT ||
            START_NODE_COL > MOBILE_COLUMN_COUNT ||
            FINISH_NODE_COL > MOBILE_COLUMN_COUNT
            ) {
            alert('Start & Finish Nodes Must Be within 10 Rows x 20 Columns');
            } else {
            grid = getInitialGrid(
                MOBILE_ROW_COUNT,
                MOBILE_COLUMN_COUNT,
            );
            setIsDesktopView(isDesktopView);
            setGrid(grid);
            }
        }
        }
    }

    const createNode = (row, col) => {
        return {
        row,
        col,
        isStart:
            row === START_NODE_ROW && col === START_NODE_COL,
        isFinish:
            row === FINISH_NODE_ROW &&
            col === FINISH_NODE_COL,
        distance: Infinity,
        distanceToFinishNode:
            Math.abs(FINISH_NODE_ROW - row) +
            Math.abs(FINISH_NODE_COL - col),
        isVisited: false,
        isWall: false,
        previousNode: null,
        isNode: true,
        };
    };

    const handleMouseDown = (row, col) => {
        if (!isRunning) {
        if (isGridClear()) {
            if (
            document.getElementById(`node-${row}-${col}`).className ===
            'node node-start'
            ) {
            setMouseIsPressed(true);
            setStartNode(true);
            setCurrRow(row);
            setCurrCol(col);
            } else if (
            document.getElementById(`node-${row}-${col}`).className ===
            'node node-finish'
            ) {

            setMouseIsPressed(true);
            setIsFinishNode(true);
            setCurrRow(row);
            setCurrCol(col);
            } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
            setMouseIsPressed(true);
            setIsWallNode(true);
            setCurrRow(row);
            setCurrCol(col);
            }
        } else {
            clearGrid();
        }
        }
    }

    const isGridClear = () => {
        for (const row of grid) {
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
        if (!isRunning) {
        if (mouseIsPressed) {
            const nodeClassName = document.getElementById(`node-${row}-${col}`)
            .className;
            if (isStartNode) {
            if (nodeClassName !== 'node node-wall') {
                const prevStartNode = grid[currRow][currCol];
                prevStartNode.isStart = false;
                document.getElementById(
                `node-${currRow}-${currCol}`,
                ).className = 'node';

                setCurrRow(row);
                setCurrCol(col);

                const currStartNode = grid[row][col];
                currStartNode.isStart = true;
                document.getElementById(`node-${row}-${col}`).className =
                'node node-start';
            }
            setSTART_NODE_ROW(row);
            setSTART_NODE_COL(col);
            } else if (isFinishNode) {
            if (nodeClassName !== 'node node-wall') {
                const prevFinishNode = grid[currRow][currCol];
                prevFinishNode.isFinish = false;
                document.getElementById(
                `node-${currRow}-${currCol}`,
                ).className = 'node';

                setCurrRow(row);
                setCurrCol(col);

                const currFinishNode = grid[row][col];
                currFinishNode.isFinish = true;
                document.getElementById(`node-${row}-${col}`).className =
                'node node-finish';
            }
            setFINISH_NODE_ROW(row);
            setFINISH_NODE_COL(col);
            } else if (isWallNode) {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
            }
        }
        }
    }

    const handleMouseUp = (row, col) => {
        if (!isRunning) {
        setMouseIsPressed(false);
        if (isStartNode) {
            const isStartNode = !isStartNode;
            setStartNode(isStartNode);
            setSTART_NODE_ROW(row);
            setSTART_NODE_COL(col);
        } else if (isFinishNode) {
            const isFinishNode = !isFinishNode;
            setIsFinishNode(isFinishNode);
            setFINISH_NODE_ROW(row);
            setFINISH_NODE_COL(col);
        }
        getInitialGrid();
        }
    }

    const handleMouseLeave = () => {
        if (isStartNode) {
        setStartNode(!isStartNode);
        setMouseIsPressed(false);
        } else if (isFinishNode) {
        setIsFinishNode(!isFinishNode);
        setMouseIsPressed(false);
        } else if (isWallNode) {
        setIsWallNode(!isWallNode);
        setMouseIsPressed(false);
        getInitialGrid();
        }
    }

    const clearGrid = () => {
        if (!isRunning) {
        const newGrid = grid.slice();
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
                Math.abs(FINISH_NODE_ROW - node.row) +
                Math.abs(FINISH_NODE_COL - node.col);
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
                Math.abs(FINISH_NODE_ROW - node.row) +
                Math.abs(FINISH_NODE_COL - node.col);
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
        if (!isRunning) {
        const newGrid = grid.slice();
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
        if (!isRunning) {
        clearGrid();
        toggleIsRunning();
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        
        // camino a dibujar 
        console.log('convertGridToPoints: ', convertGridToPoints(grid));
        console.log(`start node: (${startNode.col}, ${startNode.row})`);
        console.log(`end node: (${finishNode.col}, ${finishNode.row})`);


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
    function getNodesInShortestPathOrder(finishNode) {
        const nodesInShortestPathOrder = [];
        let currentNode = finishNode;
        while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    }


    return (
        <div>
        <table
            className="grid-container"
            onMouseLeave={() => handleMouseLeave()}>
            <tbody className="grid">
            {grid.map((row, rowIdx) => {
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
                        mouseIsPressed={mouseIsPressed}
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
        {/* <button
            type="button"
            className="btn btn-primary"
            onClick={() => visualize('JPS')}>
            JPS
        </button> */}
        </div>
    );
}