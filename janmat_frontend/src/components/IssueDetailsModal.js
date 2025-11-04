// src/components/IssueDetailsModal.js
import React from "react";

export default function IssueDetailsModal({ issue, onClose }) {
  if (!issue) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{issue.title}</h3>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </header>

        <div className="modal-body">
          <p><strong>Description:</strong><br/>{issue.description}</p>
          <p><strong>Category:</strong> {issue.category}</p>
          <p><strong>Location:</strong> {issue.location}</p>
          <p><strong>Status:</strong> <span className={`status ${issue.status.toLowerCase()}`}>{issue.status}</span></p>
          <p><strong>Reported by:</strong> {issue.created_by}</p>
          <p><small>Reported at: {new Date(issue.created_at).toLocaleString()}</small></p>
        </div>
      </div>
    </div>
  );
}
