import React from "react";
import { shallow } from "enzyme";
import HistoryComponent from "./historyComponent";

describe("HistoryComponent", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<HistoryComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
