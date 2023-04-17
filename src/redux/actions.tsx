import { Dispatch } from "redux";
import axios from "axios";
import { LOAD_REPO, LOAD_ISSUES, SET_ERROR, UPDATE_ISSUES } from "./types";
import { RepoType, IssueType } from "./StateTypes.types";

type ActionSetError = {
  type: string;
  payload: string;
};

type ActionLoadRepo = {
  type: string;
  payload: RepoType;
};

type ActionLoadIssues = {
  type: string;
  payload: IssueType;
};

export const setError = (error: string): ActionSetError => {
  return { type: SET_ERROR, payload: error };
};

export const loadRepo = (url: string) => async (dispatch: Dispatch<ActionLoadRepo | ActionSetError>) => {
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

export const updateIssues = (issues: IssueType[]): { type: string; payload: IssueType[] } => {
  return { type: UPDATE_ISSUES, payload: issues };
};
