import {ChangeEvent} from "react";
import {defaultRepoResult} from "./RepositoryForm";

type BranchSelectProps = {
  value: string;
  branches: string[];
  onBranchChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const BranchSelect = ({value, branches, onBranchChange}: BranchSelectProps) => {
  return (
    <div className={`select`}>
      <select value={value} onChange={onBranchChange}>
        <option value={defaultRepoResult.branch}>Select branch</option>
        {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
      </select>
    </div>
  );
}