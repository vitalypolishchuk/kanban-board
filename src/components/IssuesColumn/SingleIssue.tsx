import "bootstrap/dist/css/bootstrap.min.css";
import "./SingleIssue.css";
import { IssueType, BoardType } from "../../redux/StateTypes.types";
import { DragEvent } from "../../EventTypes..types";

const timeSince = (createdAt: string): string => {
  const date = new Date(createdAt);
  const seconds: number = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval: number = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }

  return Math.floor(seconds) + " seconds";
};

interface IssueTypeExtended extends IssueType {
  board: BoardType;
  item: IssueType;
  dragOverHandler: (e: DragEvent) => void;
  dragStartHandler: (e: DragEvent, board: BoardType, item: IssueType) => void;
  dropOnIssueHandler: (e: DragEvent, board: BoardType, item: IssueType) => void;
}

const SingleIssue = ({
  comments,
  createdAt,
  number,
  state,
  title,
  userType,
  inProgress,
  board,
  item,
  dragOverHandler,
  dragStartHandler,
  dropOnIssueHandler,
}: IssueTypeExtended) => {
  return (
    <div
      className="issue-container"
      onDragOver={(e) => dragOverHandler(e)}
      onDragStart={(e) => dragStartHandler(e, board, item)}
      onDrop={(e) => dropOnIssueHandler(e, board, item)}
      draggable={true}
    >
      <div className="issue-inner-container">
        <h6 className="issue-title">{title}</h6>
        <div className="issue-description">
          #{number} opened {timeSince(createdAt)} ago
        </div>
        <div className="issue-description">
          {userType} | Comments: {comments}
        </div>
      </div>
    </div>
  );
};

export default SingleIssue;
