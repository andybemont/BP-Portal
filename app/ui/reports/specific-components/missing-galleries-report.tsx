"use client";

import {
  fetchMissingGalleriesReportData,
  MissingGalleriesReportData,
} from "@/app/lib/data-model/reports/missing-galleries";
import { toNiceDateString } from "@/app/lib/helpers/client-side-helpers";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MissingGalleriesReport() {
  const [data, setData] = useState<MissingGalleriesReportData>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissingGalleriesReportData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h2 className="text-2xl">{`Shoots missing Pixieset links - ${data.clients.length} remaining`}</h2>
      <ul className="">
        {data.clients.map((client) => (
          <li key={client.client_id}>
            <Link href={`./clients/${client.client_id}/view`} target="_blank">
              {`${client.client_name} (Date: ${toNiceDateString(
                client.event_date
              )})`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
