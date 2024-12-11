"use client";

import {
  fetchRemainingEngagementShootsReportData,
  RemainingEngagementShootsReportData,
} from "@/app/lib/data-model/reports/remaining-engagement-shoots";
import { toNiceDateString } from "@/app/lib/helpers/client-side-helpers";
import { useEffect, useState } from "react";

export default function RemainingEngagementShootsReport() {
  const [data, setData] = useState<RemainingEngagementShootsReportData>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchRemainingEngagementShootsReportData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h2 className="text-2xl">{`Remaining Engagement Shoots`}</h2>
      <ul className="">
        {data.clients
          .sort((x, y) => x.wedding_date.valueOf() - y.wedding_date.valueOf())
          .map((client) => (
            <li key={client.client_name}>
              {`${toNiceDateString(client.shoot_date)}  -  ${
                client.client_name
              } (Wedding date: ${toNiceDateString(client.wedding_date)})`}
            </li>
          ))}
      </ul>
    </div>
  );
}
