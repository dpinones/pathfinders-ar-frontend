import { useStarknet } from "@starknet-react/core";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import CreateForm from "./CreateForm";
import FormContainer from "./FormContainer";
import Home from "./Home";
import "./Main.css";
import MyForms from "./MyForms";
import MyResults from "./MyResults";
import ScoreDetails from "./ScoreDetails";
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';
import React from "react";
import PathFindingOutputVisualizer from "./PathfindingVisualizer/PathFindingOutputVizualizer";
// import './App.css';

export default function Main() {
  const { account } = useStarknet();
  const [pathFindingInput, setPathFindingInput] = React.useState(null);

  const [grid, setGrid] = React.useState([]);
  const [START_NODE_COL, setSTART_NODE_ROW] = React.useState(3);
  const [START_NODE_ROW, setSTART_NODE_COL] = React.useState(10);
  const [FINISH_NODE_ROW, setFINISH_NODE_ROW] = React.useState(10);
  const [FINISH_NODE_COL, setFINISH_NODE_COL] = React.useState(16);
  const [mouseIsPressed, setMouseIsPressed] = React.useState(false);
  const [ROW_COUNT, setROW_COUNT] = React.useState(20);
  const [COLUMN_COUNT, setCOLUMN_COUNT] = React.useState(20);
  const [MOBILE_ROW_COUNT, setMOBILE_ROW_COUNT] = React.useState(9);
  const [MOBILE_COLUMN_COUNT, setMOBILE_COLUMN_COUNT] = React.useState(9);
  const [isRunning, setIsRunning] = React.useState(false);
  const [isStartNode, setStartNode] = React.useState(false);
  const [isFinishNode, setIsFinishNode] = React.useState(false);
  const [isWallNode, setIsWallNode] = React.useState(false);
  const [currRow, setCurrRow] = React.useState(0);
  const [currCol, setCurrCol] = React.useState(0);
  const [isDesktopView, setIsDesktopView] = React.useState(true);

  const props = {
    grid, setGrid,
    START_NODE_ROW, setSTART_NODE_COL,
    FINISH_NODE_ROW, setFINISH_NODE_ROW,
    START_NODE_COL, setSTART_NODE_ROW,
    FINISH_NODE_COL, setFINISH_NODE_COL,
    mouseIsPressed, setMouseIsPressed,
    ROW_COUNT, setROW_COUNT,
    COLUMN_COUNT, setCOLUMN_COUNT,
    MOBILE_ROW_COUNT, setMOBILE_ROW_COUNT,
    MOBILE_COLUMN_COUNT, setMOBILE_COLUMN_COUNT,
    isRunning, setIsRunning,
    isStartNode, setStartNode,
    isFinishNode, setIsFinishNode,
    isWallNode, setIsWallNode,
    currRow, setCurrRow,
    currCol, setCurrCol,
    isDesktopView, setIsDesktopView
  }

  return (
    <Container className="mt-3">
      {account ? (
        <div className="App">
          {!pathFindingInput && <PathfindingVisualizer setPathFindingInput={setPathFindingInput} props={props}/>}
          {pathFindingInput && <PathFindingOutputVisualizer pathFindingInput={pathFindingInput}  setPathFindingInput={setPathFindingInput} props={props}/>}
        </div>
      ) : (
        <>
          <Home />
          <p className="connect-warning mt-5">
            Please, connect your wallet to start using Starknet Forms
          </p>
        </>
      )}
    </Container>
  );
}
