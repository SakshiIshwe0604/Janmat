// src/components/Home.js
import React, { useState } from "react";
import IssueForm from "./IssueForm";
import IssueList from "./IssueList";
import IssueDetailsModal from "./IssueDetailsModal";

export default function Home() {
  const [selected, setSelected] = useState(null); // selected issue to view
  const [refreshFlag, setRefreshFlag] = useState(0); // to trigger list refresh after create

  return (
    <div className="page">
      <div className="left-col">
        <IssueForm onCreate={() => setRefreshFlag((s) => s + 1)} />
      </div>

      <div className="right-col">
        <IssueList onOpen={setSelected} refreshFlag={refreshFlag} />
      </div>

      <IssueDetailsModal issue={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
