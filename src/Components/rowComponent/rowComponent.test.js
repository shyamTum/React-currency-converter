import React from "react";
import { shallow } from "enzyme";
import RowComponent from "./rowComponent";

describe("RowComponent", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<RowComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
