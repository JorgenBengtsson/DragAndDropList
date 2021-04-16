import "./stops.css";

import { Col, Container, Form, Row } from "react-bootstrap";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import React, { useEffect, useState } from "react";
import { sortableContainer, sortableElement } from "react-sortable-hoc";

import { Multiselect } from "multiselect-react-dropdown";
import arrayMove from "array-move";

// Component to display the resulting control when an item is dragged to the list
const Control = ({ value, onChange }) => {
  const [time, setTime] = useState(value.time);
  const [days, setDays] = useState(value.days);
  const [options, setOptions] = useState([
    { name: "Måndag", id: 1 },
    { name: "Tisdag", id: 2 },
    { name: "Onsdag", id: 3 },
    { name: "Torsdag", id: 4 },
    { name: "Fredag", id: 5 },
    { name: "Lördag", id: 6 },
    { name: "Söndag", id: 7 },
  ]);
  // It keeps track of it's own changes and report them
  useEffect(() => {
    console.log("Control - onChange", value.id, value.title, time, days);
    onChange({ id: value.id, title: value.title, time: time, days: days });
  }, [time, days]);
  useEffect(() => {
    setTime(value.time);
  }, [value.time]);
  return (
    <Container>
      <Row>
        <Col>
          <Multiselect
            options={options}
            selectedValues={days}
            onSelect={(selectedList, selectedItem) => {
              setDays(selectedList);
            }}
            onRemove={(selectedList, removedItem) => {
              setDays(selectedList);
            }}
            displayValue="name"
            showArrow={true}
            showCheckbox={true}
            hidePlaceholder={true}
          />
        </Col>
        <Col sm="auto">
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "80px" }}
          />
        </Col>
        <Col sm="auto">{value.title}</Col>
      </Row>
    </Container>
  );
};

// Wrappers for the sortable elements in the list of stops
const SortableItem = sortableElement((props) => (
  <div data-id={props.value.id} className="ListItemControl">
    <Control {...props} />
  </div>
));
const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

// Component for both the list of available stops and the result
// Props: a list of available stops, the result list, and a function to save/update the changed result list
export default function Stops({ stopsList, items, saveStopList }) {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    saveStopList(arrayMove(items, oldIndex, newIndex));
  };
  // Function to update the information in a singel controller in the result list
  const updateItem = ({ id, title, time, days }) => {
    let newArray = [...items];
    newArray.forEach((element) => {
      if (element.id === id) {
        console.log(id, title, time, days);
        element.title = title;
        element.time = time;
        element.days = days;
      }
    });
    saveStopList(newArray);
  };

  // Function to insert a control element below a given element in the result list based on it's id
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

  // Function to get a Id of a element in a path (array of nodes) where the id is set with the data-id attribute
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
        {/* Column with the result list where items is dragged to */}
        <Col sm={10}>
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
        {/* Column with the list of available stops that be dragged from */}
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
