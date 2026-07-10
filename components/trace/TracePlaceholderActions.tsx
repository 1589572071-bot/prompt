"use client";

export function TracePlaceholderActions() {
  const handleClick = () => {
    window.alert("Coming soon");
  };

  return (
    <div className="trace-placeholder-actions">
      <button className="button trace-toolbar-button" disabled title="Coming soon" type="button">
        Add to datasets
      </button>
      <button className="button trace-toolbar-button" disabled title="Coming soon" type="button">
        Annotate
      </button>
      <button className="button trace-toolbar-button" onClick={handleClick} title="Coming soon" type="button">
        Add comment
      </button>
    </div>
  );
}
