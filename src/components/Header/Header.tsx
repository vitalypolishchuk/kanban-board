import "./Header.css";
import { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { loadRepo, loadIssues } from "../../redux/actions";
import { StateType } from "../../redux/StateTypes.types";
import { FormSubmitEvent } from "../../EventTypes..types";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const displayStars = (num: number, digits: number = 2) => {
  if (num === 0) return 0;
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : 0;
};

const Header = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isShowErr, setIsShowErr] = useState(false);
  const dispatch = useDispatch();
  const actions = bindActionCreators({ loadRepo, loadIssues }, dispatch);
  const repo = useSelector(({ repo }: StateType) => repo);

  useEffect(() => {
    setIsValidUrl(/^https:\/\/\w+/.test(url));
  }, [url]);

  const onSubmit = async (e: FormSubmitEvent) => {
    e.preventDefault();
    setIsShowErr(true);
    if (url === "" || !isValidUrl) return;

    const urlObj = new URL(url);
    const [userName, repo]: string[] = urlObj.pathname.split("/").slice(1);

    const repoUrl = `https://api.github.com/repos/${userName}/${repo}`;
    actions.loadRepo(repoUrl);
  };

  return (
    <>
      <Form className="form" onSubmit={onSubmit} data-testid="form">
        <Form.Control
          type="text"
          className={`input  ${isShowErr && !isValidUrl && "bg-red"}`}
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder="Enter repo url"
        />
        <Button className="button" variant="primary" type="submit">
          Load Issues
        </Button>
      </Form>
      {repo.profileName !== "" && (
        <div>
          <a href={`https://github.com/${repo.profileName}`}>{repo.profileName}</a>
          <span> &gt; </span>
          <a href={`https://github.com/${repo.profileName}/${repo.repoName}`}>{repo.repoName}</a>
          <span className="star">
            <FontAwesomeIcon icon={faStar} />
          </span>
          <span>{displayStars(repo.stars)}</span>
        </div>
      )}
    </>
  );
};

export default Header;
