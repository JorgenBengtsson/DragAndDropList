import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Stops from "./stops";

// Just locally for simplicity, can be fetch from endpoint
let stops = [
  { id: 1, title: "Stop 1", time: "00:00" },
  { id: 2, title: "Stop 2", time: "00:00" },
  { id: 3, title: "Stop 3", time: "00:00" },
  { id: 4, title: "Stop 4", time: "00:00" },
  { id: 5, title: "Stop 5", time: "00:00" },
  { id: 6, title: "Stop 6", time: "00:00" },
  { id: 7, title: "Stop 7", time: "00:00" },
  { id: 8, title: "Stop 8", time: "00:00" },
  { id: 9, title: "Stop 9", time: "00:00" },
  { id: 10, title: "Stop 10", time: "00:00" },
];

export default function App() {
  // Keeping the result at this level just as an example. Can be retrived in context or at any other level
  // Changes can be detexcted on the list, or through the SaveStopList prop on the Stops component to trigger autosave
  const [items, setItems] = useState([]);
  // Just for testing, simulating simultaneous editing of result at another level. This can be changes introduced when getting the result from the backend
  useEffect(() => {
    setInterval(() => {
      setItems((prev) => {
        if (prev.length > 0) {
          let itemsArray = [...prev];
          let d = new Date();
          itemsArray[0].title = d.toString();
          console.log(itemsArray);
          return itemsArray;
        } else {
          return [];
        }
      });
    }, 3000);
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <Stops
            stopsList={stops}
            saveStopList={(items) => setItems(items)}
            items={items}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Just displaying a live result of the list. Just for test */}
          AutoSaveResult:
          <br />
          {items.map((item) => (
            <div key={item.id}>
              {item.id} - {item.title} [{item.time}]
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
