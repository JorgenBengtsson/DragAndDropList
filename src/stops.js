import "./stops.css";

import { Col, Container, Row } from "react-bootstrap";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import React, { useEffect, useState } from "react";
import { sortableContainer, sortableElement } from "react-sortable-hoc";

import arrayMove from "array-move";

const Control = ({ value, onChange }) => {
  const [title, setTitle] = useState(value.title);
  const [time, setTime] = useState(value.time);
  useEffect(() => {
    onChange({ id: value.id, title, time });
  }, [title, time]);
  useEffect(() => {
    setTitle(value.title);
  }, [value.title]);
  useEffect(() => {
    setTime(value.time);
  }, [value.time]);
  return (
    <Container>
      <Row>
        <Col sm={2}>Stop</Col>
        <Col>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={2}>Time</Col>
        <Col>
          <input type="text" value={time} onChange={(e) => setTime(e.value)} />
        </Col>
      </Row>
    </Container>
  );
};

const SortableItem = sortableElement((props) => (
  <div data-id={props.value.id} className="ListItemControl">
    <Control {...props} />
  </div>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

export default function Stops({ stopsList, items, saveStopList }) {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    saveStopList(arrayMove(items, oldIndex, newIndex));
  };

  const updateItem = ({ id, title, time }) => {
    let newArray = [...items];
    newArray.forEach((element) => {
      if (element.id === id) {
        element.title = title;
        element.time = time;
      }
    });
    saveStopList(newArray);
  };

  const insertElemOnMe = (elem, id) => {
    let newArray = [];
    let newElem = { ...elem };
    let newId = 0;
    items.forEach((e) => {
      newArray.push({ ...e });
      if (id && e.id == id) newArray.push(newElem);
      if (e.id > newId) newId = e.id;
    });
    newElem.id = newId + 1;
    if (!id) newArray.push(newElem);
    saveStopList(newArray);
  };

  const getIdFromPath = (path) => {
    let id;
    path.forEach((e) => {
      if (e.dataset && e.dataset.id) id = e.dataset.id;
    });
    return id;
  };

  return (
    <Container>
      <Row>
        <Col>
          <DropTarget
            targetKey="stops"
            onHit={(item) => {
              insertElemOnMe(item.dragData, getIdFromPath(item.path));
            }}
          >
            <div style={{ height: "300px", overflow: "scroll" }}>
              <SortableContainer onSortEnd={onSortEnd}>
                {items.map((value, index) => (
                  <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    value={value}
                    onChange={(item) => updateItem(item)}
                    insertElemOnMe={insertElemOnMe}
                  />
                ))}
              </SortableContainer>
            </div>
          </DropTarget>
        </Col>
        <Col>
          <Container>
            {stopsList.map((item) => (
              <Row key={item.id}>
                <Col>
                  <DragDropContainer targetKey="stops" dragData={item}>
                    {item.title}
                  </DragDropContainer>
                </Col>
              </Row>
            ))}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
