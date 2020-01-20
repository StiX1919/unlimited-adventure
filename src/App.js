import React, { useState, useEffect, useRef } from "react";
import { getMap, move, prepSurroundings } from "./ducks/reducers/mapReducer";
import {
  moveMonsters,
  matchedMonsters,
  getMonsters
} from "./ducks/reducers/monsterReducer";
import "./App.css";

import { connect } from "react-redux";

import TestMap from "./components/tools/testMap";
import BattleSection from './components/tools/BattleSection'

import axios from "axios";

import styled from "styled-components";

function App(props) {
  let [state, setState] = useState({ battle: true, currMonster: {} });
  let black = false;
  let white = false;

  useEffect(() => {
    if (!props.mapR.areaMap[0]) {
      props.getMap(props.mapR.mapX, props.mapR.mapY);
      props.prepSurroundings(props.mapR.mapX, props.mapR.mapY);
    }
  });

  useEffect(() => {
    props.getMonsters(props.mapR.mapX, props.mapR.mapY, props.mapR.heroX, props.mapR.heroY);
  }, [props.mapR.mapX, props.mapR.mapY]);

  let currMonster = props.monsterR.monsters.find(
    monster => props.mapR.heroX === monster.x && props.mapR.heroY === monster.y
  );
  if (state.battle === false && currMonster) {
    setState({ ...state, battle: true, currMonster });
  } else if (state.battle && !currMonster) {
    setState({ ...state, battle: false, currMonster });
  }
//need to change this so that it updates battle order before break
  let handleMove = async direction => {
    let { heroX, heroY } = props.mapR;
    switch (direction) {
      case "up":
        heroY += 1;
        break;
      case "down":
        heroY -= 1;
        break;
      case "right":
        heroX += 1;
        break;
      case "left":
        heroX -= 1;
        break;
      default:
    }
    let iTWMon = props.monsterR.combatMons.find(mon => {
      return heroX === mon.X && heroY === mon.Y;
    });
    if (!iTWMon) {
      await props.move(direction, props.mapR);
    }
    // await props.matchedMonsters(, props.mapR.heroY);

      await props.moveMonsters(
        props.mapR.mapX,
        props.mapR.mapY,
        props.monsterR.monsters,
        props.mapR.entered,
        props.monsterR.combatMons,
        {X: iTWMon ? props.mapR.heroX : heroX, Y: iTWMon ? props.mapR.heroY : heroY}
      );

  };

  let mapRows = props.mapR.areaMap.map((row, i) => {
    return (
      <div key={i} style={{ display: "flex" }}>
        <div className="left-bar" />
        {row.map((spot, j) => {
          if (i % 2 === 0) {
            black = !black;
          } else {
            white = !white;
          }
          return (
            <StyleBox
              key={j}
              index={j}
              row={i}
              color={
                i % 2 === 0
                  ? black
                    ? "orange"
                    : "blue"
                  : white
                  ? "blue"
                  : "orange"
              }
            >
              {props.mapR.heroX === spot.x && props.mapR.heroY === spot.y ? (
                <img
                  style={
                    j > 4
                      ? {
                          marginTop: `-${30 + i * 2}px`,
                          height: `${20 + i * 2}px`,
                          width: `${20 + i * 2}px`
                        }
                      : { height: `${25 + i * 2}px`, width: `${25 + i * 2}px` }
                  }
                  className="space-content"
                  src="https://i.redd.it/txwro5tmnqx11.png"
                  alt="spiderman"
                />
              ) : props.monsterR.monsters.find(
                  monster => spot.x === monster.X && spot.y === monster.Y
                ) ? (
                <img
                  style={
                    j > 4
                      ? {
                          marginTop: `-${30 + i * 2}px`,
                          height: `${20 + i * 2}px`,
                          width: `${20 + i * 2}px`
                        }
                      : { height: `${25 + i * 2}px`, width: `${25 + i * 2}px` }
                  }
                  className="space-content"
                  src={
                    props.monsterR.monsters.find(
                      monster => spot.x === monster.X && spot.y === monster.Y
                    ).info.img_link
                  }
                  alt="goblin"
                />
              ) : null}
            </StyleBox>
          );
        })}
        <div className="right-bar" />
      </div>
    );
  });

  // console.log(props.monsterR.battleOrder)

  return (
    <div className="App">
      <div className="map-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div className="vert-bar" />
          {mapRows}
          <div className="vert-bar" />
        </div>

        <div className="d-pad">
          <div className="up-d-pad" onClick={() => handleMove("up")} />
          <div className="d-pad-center">
            <div className="left-d-pad" onClick={() => handleMove("left")} />
            <div className="right-d-pad" onClick={() => handleMove("right")} />
          </div>
          <div className="down-d-pad" onClick={() => handleMove("down")} />
        </div>
      </div>

      <BattleSection />
    </div>
  );
}

const mapStateToProps = state => {
  return { mapR: state.mapReducer, monsterR: state.monsterReducer };
};

export default connect(
  mapStateToProps,
  { getMap, move, prepSurroundings, moveMonsters, matchedMonsters, getMonsters }
)(App);

const StyleBox = styled.div`
  position: relative;
  /* display: flex; */
  /* justify-content: center;
    align-items: center; */

  ${props => {
    let { index, row, color } = props;
    let left = 10 - index * 2;

    if (index < 5) {
      return `
                border-bottom: ${30 + row * 2}px solid ${color};
                margin-right: ${20 - left + 2}px;
                width: ${20 + row * 2 - left}px;
                border-left: ${left}px solid transparent
            `;
    } else {
      return `
                border-top: ${30 + row * 2}px solid ${color};
                margin-right: ${20 - 2 + left}px;
                width: ${20 + row * 2 + left}px;
                border-left: ${-left}px solid transparent
            `;
    }
  }}

  ::after {
    ${props => {
      let { index, row, color } = props;
      let right = 8 - index * 2;
      if (index < 5) {
        return `
                    position: absolute;
                    content: "";
                    border-top: ${30 + row * 2}px solid ${color};
                    margin-left: ${5 + index}px;
                    width: ${20 + row * 2 - right}px;
                    border-right: ${right}px solid transparent
                `;
      } else {
        return `
                    position: absolute;
                    content: "";
                    border-bottom: ${30 + row * 2}px solid ${color};
                    margin-left: ${15 - index}px;
                    width: ${20 + row * 2 + right}px;
                    border-right: ${Math.abs(right)}px solid transparent;
                    margin-top: -${30 + row * 2}px;
                `;
      }
    }}
  }
`;