import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import "./IssueList.css";
import JanmatMapView from "./JanmatMapView";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("latest");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 initially
  const handleUpvote = async (issueId) => {
  try {
    await axiosInstance.post(`issues/${issueId}/upvote/`);
    // Refresh the issue list instantly after upvoting
    const updated = issues.map((issue) =>
      issue.id === issueId
        ? { ...issue, upvotes: issue.upvotes + 1 }
        : issue
    );
    setIssues(updated);
  } catch (err) {
    console.error("Upvote failed:", err);
  }
};

  // ✅ Fetch issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axiosInstance.get("issues/");
        setIssues(res.data);
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };
    fetchIssues();
  }, []);

  // ✅ Apply Search, Filter, Sort
  useEffect(() => {
    let filtered = [...issues];

    // 🔍 Search
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (issue) =>
          (issue.title &&
            issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (issue.description &&
            issue.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 📂 Category
    if (filterCategory !== "All") {
      filtered = filtered.filter(
        (issue) =>
          issue.category &&
          issue.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // ⚙️ Status
    if (filterStatus !== "All") {
      filtered = filtered.filter(
        (issue) =>
          issue.status &&
          issue.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // 🔽 Sort
    if (sortOption === "latest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOption === "upvotes") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    setFilteredIssues(filtered);
    setVisibleCount(6); // Reset count when filters change
  }, [issues, searchTerm, filterCategory, filterStatus, sortOption]);

  // ✅ Handle Load More
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleIssues = filteredIssues.slice(0, visibleCount);

  return (
    <div className="issue-list">
      <div className="issue-section">
        <h2>📋 Reported Issues</h2>

        {/* 🗺️ Map */}
        <JanmatMapView issues={issues} />

        {/* 🔍 Search + Filters */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="🔎 Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="road">Road</option>
            <option value="waste">Waste</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All Status</option>
            <option value="open">Open 🔴</option>
            <option value="in_progress">In Progress 🟡</option>
            <option value="resolved">Resolved 🟢</option>
            <option value="closed">Closed ⚫</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="filter-dropdown"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="upvotes">Most Upvoted</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("All");
              setFilterStatus("All");
              setSortOption("latest");
            }}
            className="reset-btn"
          >
            🔄 Reset
          </button>
        </div>

        {/* 🧾 Issues Grid */}
        <div className="issues-grid">
          {visibleIssues.length > 0 ? (
            visibleIssues.map((issue) => (
              <div key={issue.id} className="issue-card">
                <div className="issue-header">
                  <h3>{issue.title}</h3>
                  <span className={`status-badge ${issue.status}`}>
                    {issue.status.replace("_", " ")}
                  </span>
                </div>
                <p className="issue-description">{issue.description}</p>

                <div className="issue-meta">
                  <span className="category-tag">
                    📂 {issue.category || "General"}
                  </span>
                  <span className="creator">
                    👤 {issue.created_by_username || "Anonymous"}
                  </span>
                </div>

                <div className="issue-footer">
<button
  className="upvote-btn"
  onClick={() => handleUpvote(issue.id)}
>
  👍 {issue.upvotes || 0}
</button>                  <span className="date">
                    🕒{" "}
                    {issue.created_at
                      ? new Date(issue.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">⚠️ No matching issues found.</p>
          )}
        </div>

        {/* 🔽 Load More Button */}
        {visibleCount < filteredIssues.length && (
          <div className="load-more-container">
            <button onClick={handleLoadMore} className="load-more-btn">
              🔽 Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueList;
