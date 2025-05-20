import React, { useEffect } from 'react';
import Prism from "prismjs";
import "../assets/prism-vsc-dark.css";

import gitData from "../assets/data.json";

interface CssVar extends React.CSSProperties {
    [key: `--${string}`]: Number;
}

interface TextProps {
  boardRef: any
  selectedFile: string
}

function LineBoard({ selectedFile, boardRef }: TextProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [selectedFile]);

  return (
    <div id="lineBoard" ref={boardRef} className="lineBoard">
        <div className="headArea"></div>
        <div id="scrollTop" key="scrollTop" className="line commitHeader content-center text-center">
          Scroll right and merge commit stacks line by line.
        </div>
        {
          gitData.commits.map((commit) => {
            return [
              <div id={commit.hash} key={commit.hash} className="line commitHeader">
                <pre>{commit.author}<span className="date">{commit.date}</span><div className="font-bold">{commit.message}</div></pre>
              </div>,

              commit.changes.map((file) => {
                if (file.file != selectedFile) return;
                return file.changes.map((line) => {
                  if (line.type!="+") return;
                  return (
                    <div key={commit.hash+line.line} className="line" style={{"--line-num": line.line} as CssVar}>
                      <pre><code className={"language-"+selectedFile.split('.')[1]}>{line.content}</code></pre>
                    </div>
                  )
                })
              })
            ]
          })
        }
        <div className="tailArea"></div>
      </div>
  );
}

export default LineBoard;