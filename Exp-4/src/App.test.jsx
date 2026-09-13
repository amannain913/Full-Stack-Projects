import {describe,it,expect} from "vitest";
import {render,screen} from "@testing-library/react";
import App from "./main.jsx";

describe("Calendar",()=>{
  it("renders scheduled post count",()=>{
    render(<App/>);
    expect(screen.getByText(/4 scheduled posts/i)).toBeInTheDocument();
  });
  it("renders calendar event",()=>{
    render(<App/>);
    expect(screen.getByText("Product teaser")).toBeInTheDocument();
  });
});
