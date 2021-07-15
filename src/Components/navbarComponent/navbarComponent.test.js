import React from "react";
import { shallow } from "enzyme";
import NavbarComponent from "./navbarComponent";

describe("NavbarComponent", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<NavbarComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
