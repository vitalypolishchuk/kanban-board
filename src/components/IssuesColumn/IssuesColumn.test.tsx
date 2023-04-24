import { render as rtlRender } from "@testing-library/react";
import { AppStore } from "../../redux/StateTypes.types";
import Issues from "./IssuesColumn";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { updateIssues, updateRepo } from "../../redux/actions";
import { issues, repo } from "../../TestingData";

const render = (component: React.ReactElement) => rtlRender(<Provider store={store()}>{component}</Provider>);

let testStore: AppStore;

test("renders the component with three boards", () => {
  const { getAllByRole } = render(<Issues />);
  const boardTitles = getAllByRole("heading", { level: 4 });
  expect(boardTitles).toHaveLength(3);
  expect(boardTitles[0]).toHaveTextContent("ToDo");
  expect(boardTitles[1]).toHaveTextContent("In Progress");
  expect(boardTitles[2]).toHaveTextContent("Done");
});

describe("Repo and Issues are updated in the store", () => {
  beforeEach(() => {
    testStore = store();
    testStore.dispatch(updateRepo(repo));
    testStore.dispatch(updateIssues(issues));
  });

  test("store contains repo", () => {
    const storeState = testStore.getState();
    expect(storeState.repo).toEqual(repo);
  });

  test("store contains issues", () => {
    const storeState = testStore.getState();
    expect(storeState.issues).toEqual(issues);
  });
});
