import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { setError, loadIssues, updateIssues } from "../../redux/actions";
import { StateType, IssueType, BoardType } from "../../redux/StateTypes.types";
import { DragEvent } from "../../EventTypes..types";
import { useState, useEffect } from "react";
import SingleIssue from "../SingleIssue/SingleIssue";

const Issues = () => {
  const [currentBoard, setCurrentBoard] = useState<null | BoardType>(null);
  const [currentItem, setCurrentItem] = useState<null | IssueType>(null);

  const dispatch = useDispatch();
  const actions = bindActionCreators({ loadIssues }, dispatch);
  const { repo, issues, err } = useSelector((state: StateType) => state);
  const normalIssues: BoardType = {
    title: "ToDo",
    issues: issues.filter((issue) => issue.state === "open" && !issue.inProgress),
  };
  const inProgressIssues: BoardType = {
    title: "In Progress",
    issues: issues.filter((issue) => issue.state === "open" && issue.inProgress),
  };
  const doneIssues: BoardType = {
    title: "Done",
    issues: issues.filter((issue) => issue.state === "closed"),
  };

  useEffect(() => {
    const storageKey = `${repo.profileName}/${repo.repoName}`;

    if (repo.profileName === "") {
      return;
    }

    const localIssuesStr = localStorage.getItem(storageKey);

    if (localIssuesStr !== null) {
      const localIssues = JSON.parse(localIssuesStr);

      if (err) {
        dispatch(setError(""));
      }

      dispatch(updateIssues(localIssues));
    } else {
      const issuesUrl = `https://api.github.com/repos/${repo.profileName}/${repo.repoName}/issues?state=all`;

      actions.loadIssues(issuesUrl);
    }
  }, [repo.profileName, repo.repoName]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (err) {
      timeout = setTimeout(() => {
        dispatch(setError(""));
      }, 5000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [err]);

  const dragOverHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const dragStartHandler = (e: DragEvent, board: BoardType, item: IssueType) => {
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const changeTodo = (board: BoardType) => {
    if (currentBoard !== null && currentItem !== null) {
      if (currentBoard !== board) {
        if (board.title === "ToDo") {
          currentItem.state = "open";
          currentItem.inProgress = false;
        } else if (board.title === "In Progress") {
          currentItem.state = "open";
          currentItem.inProgress = true;
        } else if (board.title === "Done") {
          currentItem.state = "closed";
          currentItem.inProgress = false;
        }
      }
    }
  };

  const dropOnIssueHandler = (e: DragEvent, board: BoardType, item: IssueType) => {
    e.preventDefault();

    if (currentBoard === null || currentItem === null) {
      return;
    }

    changeTodo(board);

    const currentIndex = currentBoard.issues.findIndex((issue) => issue.createdAt === currentItem.createdAt);
    const dropIndex = board.issues.findIndex((issue) => issue.createdAt === item.createdAt);

    if (currentBoard.title !== board.title) {
      currentBoard.issues.splice(currentIndex, 1);
      board.issues.splice(dropIndex, 0, currentItem);
    } else {
      [currentBoard.issues[currentIndex], currentBoard.issues[dropIndex]] = [currentBoard.issues[dropIndex], currentBoard.issues[currentIndex]];
    }

    const newIssues = [normalIssues, inProgressIssues, doneIssues].map((b) => (b.title === currentBoard.title ? currentBoard : b));
    const newIssuesArr = newIssues.flatMap((b) => b.issues);

    dispatch(updateIssues(newIssuesArr));

    const newIssuesArrStr = JSON.stringify(newIssuesArr);
    localStorage.setItem(`${repo.profileName}/${repo.repoName}`, newIssuesArrStr);
  };

  const dropOnBoardHandler = (e: DragEvent, board: BoardType) => {
    e.preventDefault();

    const target = e.target;
    if (!(target instanceof Element)) {
      return;
    }

    const issueElement = target.closest(".issue-container");
    if (issueElement && issueElement.contains(target)) {
      return;
    }

    if (currentBoard === null || currentItem === null || currentBoard.title === board.title) {
      return;
    }

    changeTodo(board);

    const currentIndex = currentBoard.issues.findIndex((issue) => issue.createdAt === currentItem.createdAt);
    currentBoard.issues.splice(currentIndex, 1);
    board.issues.push(currentItem);

    const newIssues = [normalIssues, inProgressIssues, doneIssues].map((b) => (b.title === currentBoard.title ? currentBoard : b));
    const newIssuesArr = newIssues.flatMap((b) => b.issues);

    dispatch(updateIssues(newIssuesArr));

    const newIssuesArrStr = JSON.stringify(newIssuesArr);
    localStorage.setItem(`${repo.profileName}/${repo.repoName}`, newIssuesArrStr);
  };

  return (
    <>
      {err ? (
        <h1 className="err-msg">{err}</h1>
      ) : (
        <Container className="flexbox-container">
          <Row>
            {[normalIssues, inProgressIssues, doneIssues].map((board: BoardType) => {
              return (
                <Col className="flexbox-col" xs={12} md={4} key={board.title}>
                  <h4 className="issues-container-title">{board.title}</h4>
                  <div className="issue-column" onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropOnBoardHandler(e, board)}>
                    {board.issues.map((item: IssueType) => {
                      return (
                        <SingleIssue
                          key={item.createdAt}
                          comments={item.comments}
                          createdAt={item.createdAt}
                          number={item.number}
                          title={item.title}
                          userType={item.userType}
                          state={item.state}
                          inProgress={item.inProgress}
                          board={board}
                          item={item}
                          dragOverHandler={dragOverHandler}
                          dragStartHandler={dragStartHandler}
                          dropOnIssueHandler={dropOnIssueHandler}
                        />
                      );
                    })}
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
    </>
  );
};

export default Issues;
