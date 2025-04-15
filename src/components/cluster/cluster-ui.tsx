'use client'

import { useCluster } from './cluster-data-access'

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster()
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="border-2 border-primary bg-custom_black rounded-full py-2 px-4 text-xl font-medium text-primary hover:bg-primary hover:text-black cursor-pointer ">
        {cluster.name}
      </label>
      <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-gray-900 rounded-box w-52 mt-4 flex flex-col gap-2">
        {clusters.map((item) => (
          <li key={item.name}>
            <button
              className={`btn btn-sm hover:bg-custom_black ${item.active ? 'bg-primary border-none rounded-xl' : 'btn-ghost'}`}
              onClick={() => setCluster(item)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}