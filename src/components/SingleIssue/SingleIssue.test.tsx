import { render, fireEvent } from "@testing-library/react";
import { issues } from "../../TestingData";
import SingleIssue from "./SingleIssue";

test("renders issue details correctly", () => {
  const singleIssue = {
    ...issues[0],
    board: { title: "ToDo", issues: [issues[0]] },
    item: issues[0],
    dragOverHandler: jest.fn(),
    dragStartHandler: jest.fn(),
    dropOnIssueHandler: jest.fn(),
  };

  const { getByTestId } = render(<SingleIssue {...singleIssue} />);
  const issueContainer = getByTestId("issue-26704");
  expect(issueContainer).toBeInTheDocument();

  expect(getByTestId("issue-26704")).toHaveAttribute("draggable", "true");

  fireEvent.dragOver(getByTestId("issue-26704"));
  expect(singleIssue.dragOverHandler).toHaveBeenCalled();
});
