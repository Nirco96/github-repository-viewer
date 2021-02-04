import {useEffect, useRef} from "react";
import * as d3 from "d3";
import {BASE_URL} from "../App";

type CommitStatistics = {
  total: number,
  week: number,
  days: number[]
}

type RepositoryHeatmapProps = {
  repository: string;
  owner: string;
}

export const RepositoryHeatmap = ({repository, owner}: RepositoryHeatmapProps) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (repository && owner) {
      d3.json(`${BASE_URL}/${owner}/${repository}/stats/commit_activity`).then((data: any) => {
        console.log(data);
      })
    }
  }, [repository, owner]);


  return (
    <div ref={chartRef}></div>
  )
}