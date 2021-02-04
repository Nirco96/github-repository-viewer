import React, {useRef, useState} from 'react';
import './App.css';
import {defaultRepoResult, RepositoryForm, RepositoryFormResult} from "./RepositoryForm";
import {Commit, createCommitFromJson, getCommitsUrlForRepo} from "./commits.util";
import {CommitsList} from "./CommitsList";
import {useInfiniteScroll} from "./UseInfiniteScroll";
import axios, {AxiosError, AxiosResponse} from "axios";
import loadingSvg from "./Rolling-1s-100px.svg"

const ACCESS_TOKEN = `1be428951bffe33129ae461117525afd9f591634`;
const COMMITS_PER_PAGE = 10;
export const BASE_URL = `https://api.github.com/repos`;

export const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `token ${ACCESS_TOKEN}`
  }
})

function fetchCommits(repoQuery: RepositoryFormResult, page: number) {
  return client.get(getCommitsUrlForRepo(repoQuery, page, COMMITS_PER_PAGE));
}

function App() {
  const [repoQuery, setRepoQuery] = useState<RepositoryFormResult>(defaultRepoResult)
  const [commits, setCommits] = useState<Array<Commit>>([]);
  const [page, setPage] = useState(1);
  const [disableRefetch, setDisableRefetch] = useState(true);
  const scrollEl = useRef(null);
  const [error, setError] = useState('');
  const isLoading = useInfiniteScroll({callback: fetchNextPage, element: scrollEl?.current, disabled: disableRefetch});

  const handleCommits = (response: AxiosResponse) => {
    let commits = response.data;
    setCommits(prevState => [...prevState, ...commits?.map((cJson: any) => createCommitFromJson(cJson))]);

    if (commits.length < COMMITS_PER_PAGE) {
      setDisableRefetch(true);
    } else {
      nextPage();
    }
  }

  const handleError = (error: AxiosError) => {
    if (error.response) {
      setError(error.response.data.message);
    } else {
      setError('An error has occurred, please check your input and try again.');
    }

    setDisableRefetch(true);
  }

  function fetchNextPage() {
    return fetchCommits(repoQuery, page)
      .then(handleCommits)
      .catch(handleError);
  }

  const resetState = (disableFetch: boolean = false) => {
    setPage(1);
    setCommits([]);
    setError('');
    setDisableRefetch(disableFetch)
  }

  const onRepoResultChange = (res: RepositoryFormResult, reset = false) => {
    setRepoQuery(res);
    resetState(reset);
  }

  const nextPage = () => {
    setPage(page + 1);
  }

  return (
    <React.Fragment>
      <section className={`section`}>
        <div className={`navbar is-fixed-top`}>
          <div className={`navContent`}>
            <div className={`title`}>Welcome to GitHub Repository Viewer</div>
            <RepositoryForm onSubmit={onRepoResultChange}></RepositoryForm>
          </div>
        </div>
      </section>
      <section className={`section`}>
        {error ? error : <CommitsList commits={commits}></CommitsList>}
        <div className={`loading`} ref={scrollEl}>{isLoading ? <img alt={'loading...'} src={loadingSvg}/> : ''}</div>
      </section>
      {/*<div className={`heatmapContainer`}>*/}
        {/*<RepositoryHeatmap repository={repoQuery.repository} owner={repoQuery.owner}></RepositoryHeatmap>*/}
      {/*</div>*/}
    </React.Fragment>
  );
}

export default App;