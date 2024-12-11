"use client";

import {
  ExpectedIncomeReportData,
  fetchExpectedIncomeReportData,
} from "@/app/lib/data-model/reports/expected-income";
import { toNiceDateString } from "@/app/lib/helpers/client-side-helpers";
import { useEffect, useState } from "react";

export default function ExpectedIncomeReport() {
  const [data, setData] = useState<ExpectedIncomeReportData>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpectedIncomeReportData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h2 className="text-2xl">{`Expected Payments (total $${data.clients.reduce(
        (sum, current) => {
          return sum + (current.total_cost - current.total_payments);
        },
        0
      )})`}</h2>
      <ul className="">
        {data.clients
          .sort((x, y) => x.event_date.valueOf() - y.event_date.valueOf())
          .map((client) => (
            <li key={client.client_name}>
              {`$${
                client.total_cost - client.total_payments
              }  - ${toNiceDateString(client.event_date)} ${
                client.client_name
              }`}
            </li>
          ))}
      </ul>
    </div>
  );
}
