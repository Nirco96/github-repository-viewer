import {Commit} from "./commits.util";
import "./CommitsList.css";
import {ChangeEvent, useState} from "react";

type CommitsListProps = {
  commits: Commit[];
}

export const CommitsList = ({commits}: CommitsListProps) => {
  const [authorFilter, setAuthorFilter] = useState('');

  const changeAuthorFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(e.target.value);
  }

  let filteredCommits = commits;

  if (authorFilter) {
    filteredCommits = filteredCommits.filter((c) => c.author.toLowerCase().startsWith(authorFilter.toLowerCase()));
  }

  return (
    <div className={`container`}>
      <div className={`block wideCentered`}>
        <input value={authorFilter} type={`text`} className={`input authorFilter`} onChange={changeAuthorFilter} placeholder={`Filter by author`}/>
      </div>
      {filteredCommits.map((c, i) => <CommitListItem key={c.sha} message={c.message} author={c.author} date={c.date}
                                             sha={c.sha} index={i + 1}></CommitListItem>)}
    </div>
  )
}

export const CommitListItem = ({author, date, message, sha, index}: Commit & { index: number }) => {
  return (
    <article className="message">
      <div className="message-header">
        <p>Commit #{index}</p>
      </div>
      <div className="message-body">
        <div className={`commitData`}>
          <div className={`commitMessage`}>
            {message}
          </div>
          <div className={`commitDetails`}>
            <div className={`commitDetail`}>
              <div className={`title is-5`}>{author}</div>
              <div className={`subtitle is-6`}>Committed by</div>
            </div>
            <div className={`commitDetail`}>
              <div className={`title is-5`}>{date?.toLocaleDateString()}</div>
              <div className={`subtitle is-6`}>Committed on</div>
            </div>
            <div className={`commitDetail`}>
              <div className={`title is-5`}>{sha}</div>
              <div className={`subtitle is-6`}>SHA</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}