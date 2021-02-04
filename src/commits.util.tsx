import {RepositoryFormResult} from "./RepositoryForm";

export interface Commit {
  author: string,
  message: string,
  sha: string,
  date: Date
}

export const createCommitFromJson: (json: any) => Commit = (json: any)  => {
  return {
    author: json.commit.author.name,
    message: json.commit.message,
    sha: json.sha,
    date: new Date(json.commit.author.date)
  }
}

export const getCommitsUrlForRepo = ({repository, owner, branch}: RepositoryFormResult, page: number, commitsPerPage: number) => {
  return `/${owner}/${repository}/commits?per_page=${commitsPerPage}&page=${page}&sha=${branch}`
}

export const getBranchesUrlForRepo = (repository: string, owner: string) => {
  return `/${owner}/${repository}/branches`
}