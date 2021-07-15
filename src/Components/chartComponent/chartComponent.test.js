import React from "react";
import { shallow } from "enzyme";
import ChartComponent from "./chartComponent";

describe("ChartComponent", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ChartComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
