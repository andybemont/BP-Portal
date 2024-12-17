"use client";

import { useState } from "react";
import ExpectedIncomeReport from "./specific-components/expected-income-report";
import RemainingEngagementShootsReport from "./specific-components/remaining-engagement-shoots-report";
import MissingGalleriesReport from "./specific-components/missing-galleries-report";

const expectedIncome = "Remaining Payments";
const remainingEngagementShoots = "Remaining Engagement Shoots";
const missingGalleries = "Missing Galleries";
const allReports = [
  expectedIncome,
  remainingEngagementShoots,
  missingGalleries,
];
allReports.sort();

export default function ReportsView() {
  const [selectedReport, setSelectedReport] = useState<string>();

  return (
    <div className="overflow-hidden rounded-md bg-green/20 m-1 p-2 pb-0 min-h-screen flex flex-col">
      <select
        id="user_id"
        name="user_id"
        className="w-full rounded-md bg-white/50 border-black/50 py-1 text-sm outline-2 h-8 max-w-[250px]"
        onChange={(e) => {
          setSelectedReport(e.target.value);
        }}
      >
        <option key="none" value="">
          Choose a report
        </option>
        {allReports.map((report) => (
          <option key={report} value={report}>
            {report}
          </option>
        ))}
      </select>
      <div className="rounded-md bg-green/20 mt-2 p-2 grow">
        {selectedReport === expectedIncome && <ExpectedIncomeReport />}
        {selectedReport === remainingEngagementShoots && (
          <RemainingEngagementShootsReport />
        )}
        {selectedReport === missingGalleries && <MissingGalleriesReport />}
      </div>
    </div>
  );
}
