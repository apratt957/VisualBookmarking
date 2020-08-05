import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import Draggable from "./Draggable";

import "./App.css";

function App() {
  const [bookmarks, setBookmarks] = useState([]);

  const onDrop = (event) => {
    event.preventDefault();
    console.dir(event.dataTransfer);
    const { offsetX, offsetY } = event.nativeEvent;
    let text = event.dataTransfer.getData("text/uri-list");

    if (text) {
      const im = getHTMLMarkup(event.dataTransfer);
      text = event.dataTransfer.getData("text/html");
      setBookmarks((bookmarks) => [
        ...bookmarks,
        {
          text: im[0].element.src,
          alt: im[0].element.alt,
          relX: offsetX,
          relY: offsetY,
          imageObject: text,
        },
      ]);
    } else {
      text = event.dataTransfer.getData("text/html");
      console.log(text);
      setBookmarks((bookmarks) => [
        ...bookmarks,
        { text: text, relX: offsetX, relY: offsetY },
      ]);
    }
  };

  const onDragEnter = (event) => {
    event.stopPropagation();
  };

  const onDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const getHTMLMarkup = (dT) => {
    var markup = dT.getData("text/html");
    if (markup) {
      var doc = new DOMParser().parseFromString(markup, "text/html");
      var imgs = (doc && doc.querySelectorAll("img,image")) || [];
      imgs.forEach(toImageObject);
      return Array.prototype.map.call(imgs, toImageObject);
    }
  };

  const toImageObject = (element) => {
    var img;
    if (element instanceof SVGImageElement) {
      img = new Image();
      img.src =
        element.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
        element.getAttribute("href");
    } else {
      img = document.adoptNode(element);
    }
    return {
      type: "element",
      element: img,
    };
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="App"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {bookmarks.map((bookmark) => {
        if (bookmark.imageObject) {
          return (
            <Draggable key={bookmark.text} x={bookmark.relX} y={bookmark.relY}>
              <div
                style={{ height: "100%", width: "auto" }}
                dangerouslySetInnerHTML={{ __html: bookmark.imageObject }}
              ></div>
            </Draggable>
          );
        } else {
          return (
            <Draggable key={bookmark.text} x={bookmark.relX} y={bookmark.relY}>
              {ReactHtmlParser(bookmark.text)}
            </Draggable>
          );
        }
      })}
    </div>
  );
}

export default App;
