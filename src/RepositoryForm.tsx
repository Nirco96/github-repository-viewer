import {ChangeEvent, useState} from "react";
import {BranchSelect} from "./BranchSelect";
import {client} from "./App";
import {getBranchesUrlForRepo} from "./commits.util";
import "./RepositoryForm.css"

export type RepositoryFormResult = {
  owner: string,
  repository: string,
  branch: string
}

export const defaultRepoResult: RepositoryFormResult = {
  owner: '',
  repository: '',
  branch: ''
}

type RepositoryFormProps = {
  onSubmit: (result: RepositoryFormResult, reset?: boolean) => void;
}

export const RepositoryForm = ({onSubmit}: RepositoryFormProps) => {
  const [repository, setRepository] = useState(defaultRepoResult.repository);
  const [owner, setOwner] = useState(defaultRepoResult.owner);
  const [branch, setBranch] = useState(defaultRepoResult.branch);
  const [branches, setBranches] = useState<string[]>([]);
  const [allowBranchSelect, setAllowBranchSelect] = useState(false);

  const repositoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (allowBranchSelect) {
      setAllowBranchSelect(false);
    }

    setRepository(e.target.value);
  }
  const ownerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (allowBranchSelect) {
      setAllowBranchSelect(false);
    }

    setOwner(e.target.value);
  }

  const loadBranches = () => {
    client.get(getBranchesUrlForRepo(repository, owner)).then(response => {
      setBranches(response.data.map((branchJson: any) => branchJson.name));
      setAllowBranchSelect(true);
    }).catch(error => setAllowBranchSelect(false));
  }

  const branchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBranch(e.target.value);
  }

  const submit = () => {
    onSubmit({repository: repository, owner: owner, branch: branch});
  }

  const reset = () => {
    setRepository(defaultRepoResult.repository);
    setOwner(defaultRepoResult.owner);
    setBranch(defaultRepoResult.branch);
    setBranches([]);
    setAllowBranchSelect(false);
    onSubmit({repository: repository, owner: owner, branch: branch}, true);
  }

  const canLoadBranches = () => {
    return repository !== defaultRepoResult.repository && owner !== defaultRepoResult.owner;
  }

  const canSubmit: () => boolean = () => {
    return canLoadBranches() && branch !== defaultRepoResult.branch;
  }

  return (
    <div>
      <div className={`columns`}>
        <div className={`column`}>
          <input name={'repository'} value={repository} type="text"
                 className="input" placeholder="Repository name" onChange={repositoryChange}></input>
        </div>
        <div className={`column`}>
          <input name={'owner'} value={owner} type="text"
                 className="input" placeholder="Repository owner" onChange={ownerChange}></input>
        </div>
        <div className={`column`}>
          {allowBranchSelect ?
            <BranchSelect value={branch} branches={branches} onBranchChange={branchChange}/> :
            <input name={'branch'} value={branch} type="text"
                   className="input" placeholder="Branch name" onChange={branchChange}></input>}
        </div>
        <div className={`column`}>
          <button disabled={!canLoadBranches()} className={`button`} onClick={() => loadBranches()}>Load branches
          </button>
        </div>
      </div>
      <div className={`wideCentered`}>
        <button disabled={!canSubmit()} className={`button is-primary repoButtons`} onClick={submit}>Search</button>
        <button disabled={!canSubmit()} className={`button is-danger repoButtons`} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}