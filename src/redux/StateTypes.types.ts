import { store } from "./store";

export type AppStore = ReturnType<typeof store>;

export interface RepoType {
  profileName: string;
  repoName: string;
  stars: number;
  profileUrl: string;
  repoUrl: string;
}

export interface IssueType {
  title: string;
  number: number;
  createdAt: string;
  userType: string;
  comments: number;
  state: string;
  inProgress: boolean;
}

export interface BoardType {
  title: string;
  issues: IssueType[];
}

export interface StateType {
  repo: RepoType;
  issues: IssueType[];
  err: string;
}
