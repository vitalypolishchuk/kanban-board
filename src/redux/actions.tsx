import { Dispatch } from "redux";
import axios from "axios";
import { LOAD_REPO, LOAD_ISSUES, SET_ERROR, UPDATE_ISSUES, CLEAR_ISSUES, CLEAR_REPO } from "./types";
import { RepoType, IssueType } from "./StateTypes.types";

type ActionSetError = {
  type: typeof SET_ERROR;
  payload: string;
};

type ActionLoadRepo = {
  type: typeof LOAD_REPO;
  payload: RepoType;
};

type ActionLoadIssues = {
  type: typeof LOAD_ISSUES;
  payload: IssueType;
};

type ActionClearIssues = {
  type: typeof CLEAR_ISSUES;
};

type ActionClearRepo = {
  type: typeof CLEAR_REPO;
};

export const setError = (error: string): ActionSetError => {
  return { type: SET_ERROR, payload: error };
};

export const clearRepo = (): ActionClearRepo => {
  return { type: CLEAR_REPO };
};

export const updateIssues = (issues: IssueType[]): { type: string; payload: IssueType[] } => {
  return { type: UPDATE_ISSUES, payload: issues };
};

export const clearIssues = (): ActionClearIssues => {
  return { type: CLEAR_ISSUES };
};

export const loadRepo = (url: string) => async (dispatch: Dispatch<ActionLoadRepo | ActionSetError | ActionClearRepo | ActionClearIssues>) => {
  try {
    const { data }: any = await axios.get(url);
    const repoUrl = `https://github.com/${data.full_name}`;
    const repo = {
      profileName: data.owner.login,
      repoName: data.name,
      stars: data.stargazers_count,
      profileUrl: data.owner.html_url,
      repoUrl: repoUrl,
    };
    dispatch({ type: LOAD_REPO, payload: repo });
  } catch (error: any) {
    dispatch(clearRepo());
    dispatch(clearIssues());
    if (error.response) {
      dispatch(setError(`Request failed with status code ${error.response.status}`));
    } else if (error.request) {
      dispatch(setError("Request failed: no response received"));
    } else {
      dispatch(setError(`Request failed: ${error.message}`));
    }
  }
};

export const loadIssues = (url: string) => async (dispatch: Dispatch<ActionLoadIssues | ActionSetError>) => {
  try {
    const res = await axios.get(url);

    if (res.data.length === 0) {
      throw new Error("No issues found!");
    }

    const issues = res.data.map((issue: any) => {
      const inProgress = issue.assignee !== null;

      return {
        title: issue.title,
        number: issue.number,
        createdAt: issue.created_at,
        userType: issue.user.type,
        comments: issue.comments,
        state: issue.state,
        inProgress,
      };
    });

    dispatch({ type: LOAD_ISSUES, payload: issues });
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};
