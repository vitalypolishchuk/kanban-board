import { screen, render as rtlRender, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

const render = (component: React.ReactElement) => rtlRender(<Provider store={store()}>{component}</Provider>);

describe("Header is rendered properly with different states", () => {
  test("Button is rendered", () => {
    const { getByRole } = render(<Header />);
    const buttonElement = getByRole("button", { name: "Load Issues" });
    expect(buttonElement).toBeInTheDocument();
  });

  test("updates the url state when input field value changes", () => {
    render(<Header />);
    const inputField = screen.getByPlaceholderText("Enter repo url") as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: "https://github.com/facebook/react" } });
    expect(inputField.value).toBe("https://github.com/facebook/react");
  });

  // ----> before running test, pass onSubmit as a prop to the Header component <----
  // test("calls onSubmit function when form is submitted", () => {
  //   const onSubmit = jest.fn();
  //   const { getByTestId } = render(<Header onSubmit={onSubmit} />);
  //   const form = getByTestId("form");
  //   fireEvent.submit(form);
  //   expect(onSubmit).toHaveBeenCalled();
  // });

  // ----> before running test, pass onSubmit as a prop to the Header component <----
  // test("calls loadRepo function with correct URL when form is submitted with valid URL", () => {
  //   const loadRepo = jest.fn();
  //   const { getByRole, getByPlaceholderText } = render(<Header loadRepo={loadRepo} />);
  //   const inputField = getByPlaceholderText("Enter repo url");
  //   const form = getByRole("form");
  //   fireEvent.change(inputField, { target: { value: "https://github.com/facebook/react" } });
  //   fireEvent.submit(form);
  //   expect(loadRepo).toHaveBeenCalledWith("https://api.github.com/repos/facebook/react");
  // });

  test("updates isValidUrl state correctly when input field value changes", () => {
    const { getByPlaceholderText, getByRole } = render(<Header />);
    const inputField = getByPlaceholderText("Enter repo url");
    fireEvent.change(inputField, { target: { value: "invalid url" } });

    const buttonElement = getByRole("button", { name: "Load Issues" });
    userEvent.click(buttonElement);
    expect(inputField.classList).toContain("bg-red");
  });
});
